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

// POST /api/qanything/stream-direct - 直接转发流式聊天（最小延迟）
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

    // 创建流式响应 - 直接转发模式
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

          console.log('QAnything API Direct Request:', JSON.stringify(finalRequestData, null, 2));

          // 直接调用QAnything API，不进行重试（减少延迟）
          const response = await fetch('https://openapi.youdao.com/q_anything/api/chat_stream', {
            method: 'POST',
            headers: {
              'Authorization': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalRequestData),
          });

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

          // 直接转发原始字节流 - 最小延迟模式
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('无法读取响应流');
          }

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) break;

              // 直接转发原始字节，不进行任何处理
              // 这样可以获得最佳的实时性能
              controller.enqueue(value);
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
    console.error('QAnything Stream Direct API Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
