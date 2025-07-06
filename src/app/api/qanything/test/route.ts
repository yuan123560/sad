import { NextResponse } from 'next/server';

// GET /api/qanything/test - 测试QAnything API连接
export async function GET() {
  try {
    const apiKey = process.env.QANYTHING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'QAnything API Key not configured' },
        { status: 500 }
      );
    }

    // 首先获取或创建知识库
    let kbId;
    try {
      // 尝试获取现有知识库
      const listResponse = await fetch('https://openapi.youdao.com/q_anything/api/kb_list', {
        method: 'GET',
        headers: {
          'Authorization': apiKey,
        },
      });

      if (listResponse.ok) {
        const listData = await listResponse.json();
        console.log('Knowledge base list response:', listData);
        if (listData.errorCode == 0 && listData.result && listData.result.length > 0) {
          kbId = listData.result[0].kbId;
          console.log('Using existing knowledge base:', kbId);
        }
      } else {
        const errorText = await listResponse.text();
        console.error('Failed to list knowledge bases:', listResponse.status, errorText);
      }

      // 如果没有知识库，创建一个
      if (!kbId) {
        console.log('Creating new knowledge base...');
        const createResponse = await fetch('https://openapi.youdao.com/q_anything/api/create_kb', {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kbName: 'Course Showcase 测试知识库',
          }),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log('Create knowledge base response:', createData);
          if (createData.errorCode == 0) {
            kbId = createData.result.kbId;
            console.log('Created new knowledge base:', kbId);

            // 添加一个测试FAQ
            const formData = new FormData();
            formData.append('kbId', kbId);
            formData.append('question', '你好');
            formData.append('answer', '你好！我是Course Showcase的AI助手，很高兴为您服务。');

            const faqResponse = await fetch('https://openapi.youdao.com/q_anything/api/upload_faq', {
              method: 'POST',
              headers: {
                'Authorization': apiKey,
              },
              body: formData,
            });

            if (faqResponse.ok) {
              const faqData = await faqResponse.json();
              console.log('Added FAQ:', faqData.result?.faqId);
            }
          } else {
            console.error('Failed to create knowledge base:', createData);
          }
        } else {
          const errorText = await createResponse.text();
          console.error('Create knowledge base request failed:', createResponse.status, errorText);
        }
      }
    } catch (error) {
      console.error('Knowledge base setup error:', error);
    }

    // 准备测试请求
    const testData = {
      question: '你好',
      kbIds: kbId ? [kbId] : [], // 使用创建的知识库ID
      prompt: '',
      history: [], // 必需参数
      model: 'QAnything 4o mini',
      maxToken: 200,
      hybridSearch: false,
      networking: true,
      sourceNeeded: true,
    };

    console.log('Testing QAnything API with data:', JSON.stringify(testData, null, 2));
    console.log('Using API Key:', apiKey.substring(0, 10) + '...');

    const response = await fetch('https://openapi.youdao.com/q_anything/api/chat_stream', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('QAnything API Response Status:', response.status);
    console.log('QAnything API Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('QAnything API Error Response:', errorText);
      
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: errorText,
        requestData: testData,
      }, { status: response.status });
    }

    // 读取一小部分响应来测试
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({
        success: false,
        error: '无法读取响应流',
      }, { status: 500 });
    }

    const decoder = new TextDecoder();
    const chunks = [];
    let chunkCount = 0;
    const maxChunks = 3; // 只读取前几个chunk来测试

    try {
      while (chunkCount < maxChunks) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        chunks.push(chunk);
        chunkCount++;
      }
    } finally {
      reader.releaseLock();
    }

    return NextResponse.json({
      success: true,
      message: 'QAnything API connection successful',
      sampleChunks: chunks,
      requestData: testData,
    });

  } catch (error) {
    console.error('QAnything Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
