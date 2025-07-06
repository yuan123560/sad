import { NextRequest } from 'next/server';
import { QAnythingChatRequest } from '@/types';

// 获取或创建知识库
async function getOrCreateKnowledgeBase(apiKey: string): Promise<string> {
  try {
    // 首先尝试获取现有知识库列表
    const listResponse = await fetch('https://openapi.youdao.com/q_anything/api/kb_list', {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
      },
    });

    if (listResponse.ok) {
      const listData = await listResponse.json();
      if (listData.errorCode == 0 && listData.result && listData.result.length > 0) {
        // 使用第一个知识库
        const kbId = listData.result[0].kbId;
        console.log('Using existing knowledge base:', kbId);
        return kbId;
      }
    }

    // 如果没有知识库，创建一个新的
    console.log('Creating new knowledge base...');
    const createResponse = await fetch('https://openapi.youdao.com/q_anything/api/create_kb', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kbName: 'Course Showcase AI助手',
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create knowledge base: ${createResponse.status} - ${errorText}`);
    }

    const createData = await createResponse.json();
    if (createData.errorCode != 0) {
      throw new Error(`Knowledge base creation failed: ${createData.msg}`);
    }

    const newKbId = createData.result.kbId;
    console.log('Created new knowledge base:', newKbId);
    console.log('Please add FAQs through QAnything platform to enable Q&A functionality.');

    return newKbId;
  } catch (error) {
    console.error('Error managing knowledge base:', error);
    throw error;
  }
}

// QAnything知识库管理
// 注意：FAQ内容应该通过QAnything平台管理，不在代码中创建

// POST /api/qanything/stream - 流式聊天
export async function POST(request: NextRequest) {
  try {
    const body: QAnythingChatRequest = await request.json();

    // 验证API密钥
    const apiKey = process.env.QANYTHING_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'QAnything API Key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 验证请求参数
    if (!body.question || body.question.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: '问题不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 准备请求数据 - 根据QAnything API文档格式
    const requestData = {
      question: body.question,
      kbIds: body.kbIds && body.kbIds.length > 0 ? body.kbIds : [], // 确保是数组
      prompt: body.prompt || '',
      history: body.history || [],
      model: body.model || 'QAnything 4o mini',
      maxToken: body.maxToken || 1024, // 保持数字格式
      hybridSearch: body.hybridSearch || false, // 保持布尔格式
      networking: body.networking !== undefined ? body.networking : false, // 默认关闭联网
      sourceNeeded: body.sourceNeeded !== undefined ? body.sourceNeeded : true, // 保持布尔格式
    };

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 确定要使用的知识库ID
          let finalKbIds = requestData.kbIds;

          // 如果前端没有指定知识库，则获取或创建一个默认知识库
          if (!finalKbIds || finalKbIds.length === 0) {
            const defaultKbId = await getOrCreateKnowledgeBase(apiKey);
            finalKbIds = [defaultKbId];
          }

          // 验证知识库ID格式（QAnything知识库ID通常以KB开头）
          const validKbIds = finalKbIds.filter(id => id && typeof id === 'string' && id.startsWith('KB'));
          if (validKbIds.length === 0) {
            throw new Error('无效的知识库ID格式');
          }
          finalKbIds = validKbIds;

          // 准备请求数据，使用正确的数字和布尔类型格式
          const finalRequestData = {
            question: requestData.question,
            kbIds: finalKbIds, // 使用前端指定的知识库ID或默认知识库ID
            prompt: requestData.prompt || '',
            history: requestData.history || [], // 必需参数：对话历史，确保是简单数组
            model: requestData.model || 'QAnything 4o mini',
            maxToken: requestData.maxToken || 1024, // 数字类型
            hybridSearch: requestData.hybridSearch || false, // 布尔类型
            networking: requestData.networking !== undefined ? requestData.networking : false, // 布尔类型，默认false
            sourceNeeded: requestData.sourceNeeded !== undefined ? requestData.sourceNeeded : true, // 布尔类型
          };

          console.log('QAnything API Request:', JSON.stringify(finalRequestData, null, 2));

          // 调用真实的QAnything API，添加重试逻辑
          let response: Response | undefined;
          let retryCount = 0;
          const maxRetries = 2;

          while (retryCount <= maxRetries) {
            try {
              response = await fetch('https://openapi.youdao.com/q_anything/api/chat_stream', {
                method: 'POST',
                headers: {
                  'Authorization': apiKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalRequestData),
              });

              // 如果成功或者不是服务器错误，跳出重试循环
              if (response.ok || response.status < 500) {
                break;
              }

              // 如果是服务器错误且还有重试次数，等待后重试
              if (retryCount < maxRetries) {
                console.log(`QAnything API server error (${response.status}), retrying... (${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // 递增延迟
                retryCount++;
              } else {
                break;
              }
            } catch (fetchError) {
              console.error('QAnything API fetch error:', fetchError);
              if (retryCount < maxRetries) {
                console.log(`Network error, retrying... (${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                retryCount++;
              } else {
                throw fetchError;
              }
            }
          }

          if (!response) {
            throw new Error('Failed to get response from QAnything API after retries');
          }

          if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

            try {
              const errorText = await response.text();
              if (errorText) {
                console.error('QAnything API Error Response:', errorText);

                // 尝试解析错误详情
                try {
                  const errorData = JSON.parse(errorText);
                  if (errorData.errorCode === '303' || errorData.errorCode === 303) {
                    errorMessage = 'QAnything服务器暂时不可用，请稍后重试';
                  } else if (errorData.errorCode === '406' || errorData.errorCode === 406) {
                    errorMessage = 'QAnything API参数错误，请检查知识库设置';
                  } else if (errorData.msg) {
                    errorMessage = `QAnything API错误：${errorData.msg}`;
                  }
                } catch {
                  // 如果不是JSON格式，使用原始错误文本
                  errorMessage += ` - ${errorText}`;
                }
              }
            } catch (e) {
              console.error('Failed to read error response:', e);
            }

            // 发送友好的错误消息给客户端
            const errorData = {
              errorCode: -1,
              msg: errorMessage,
              result: {
                question: finalRequestData.question,
                response: `抱歉，${errorMessage}`,
                history: finalRequestData.history || [],
              },
            };

            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify(errorData)}\n\n`)
            );
            controller.close();
            return;
          }

          // 处理流式响应
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('无法读取响应流');
          }

          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                // QAnything API返回格式：event:data 和 data:{...}
                if (line.startsWith('event:data')) {
                  // 发送事件类型
                  controller.enqueue(
                    new TextEncoder().encode(`event: data\n`)
                  );
                } else if (line.startsWith('data:')) {
                  try {
                    // 解析JSON数据
                    const jsonStr = line.slice(5).trim(); // 移除 'data:' 前缀并去除空白

                    // 跳过空的data行
                    if (!jsonStr) {
                      controller.enqueue(
                        new TextEncoder().encode(`${line}\n`)
                      );
                      continue;
                    }

                    const data = JSON.parse(jsonStr);

                    // 检查是否是错误响应
                    if (data.errorCode && data.errorCode !== 0) {
                      console.error('QAnything API returned error:', data);

                      // 确保错误响应有正确的格式
                      const errorResponse = {
                        errorCode: data.errorCode,
                        msg: data.msg || 'QAnything API error',
                        requestId: data.requestId || '',
                        result: {
                          question: finalRequestData.question,
                          response: data.result?.response || `抱歉，${data.msg || 'QAnything API出现错误'}`,
                          history: data.result?.history || finalRequestData.history || [],
                          source: data.result?.source || [],
                        },
                      };

                      // 发送格式化的错误响应
                      controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify(errorResponse)}\n\n`)
                      );
                    } else {
                      // 正常响应，直接转发
                      controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
                      );
                    }
                  } catch (parseError) {
                    console.warn('Failed to parse SSE data:', line, parseError);
                    // 如果解析失败，直接转发原始数据
                    controller.enqueue(
                      new TextEncoder().encode(`${line}\n`)
                    );
                  }
                } else if (line.trim() === '') {
                  // 空行，保持SSE格式
                  controller.enqueue(
                    new TextEncoder().encode(`\n`)
                  );
                }
              }
            }
          } finally {
            reader.releaseLock();
          }

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          
          // 发送错误信息
          const errorData = {
            errorCode: -1,
            msg: error instanceof Error ? error.message : 'Unknown error',
            result: {
              question: body.question,
              response: '抱歉，处理您的请求时出现了错误。',
              history: body.history || [],
            },
          };
          
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify(errorData)}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('QAnything Stream API Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
