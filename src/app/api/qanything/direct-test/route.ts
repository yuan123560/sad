import { NextResponse } from 'next/server';

// GET /api/qanything/direct-test - 直接测试QAnything API
export async function GET() {
  try {
    const apiKey = process.env.QANYTHING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'QAnything API Key not configured' },
        { status: 500 }
      );
    }

    // 直接调用QAnything API（使用正确的参数类型）
    const requestData = {
      question: '你好',
      kbIds: ['KB953e51ad095742629192eb0bf4a3a748_240430'],
      history: [],
      model: 'QAnything 4o mini',
      maxToken: 1024, // 数字类型
      hybridSearch: false, // 布尔类型
      networking: true, // 布尔类型
      sourceNeeded: true, // 布尔类型
    };

    console.log('Direct QAnything API Request:', JSON.stringify(requestData, null, 2));

    const response = await fetch('https://openapi.youdao.com/q_anything/api/chat_stream', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('QAnything API Response Status:', response.status);
    console.log('QAnything API Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('QAnything API Error Response:', errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText,
          requestData 
        },
        { status: response.status }
      );
    }

    // 读取流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { success: false, error: 'Cannot read response stream' },
        { status: 500 }
      );
    }

    const decoder = new TextDecoder();
    const chunks: string[] = [];
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        chunks.push(chunk);
        fullResponse += chunk;
      }
    } finally {
      reader.releaseLock();
    }

    console.log('Full QAnything Response:', fullResponse);

    return NextResponse.json({
      success: true,
      message: 'QAnything API direct test successful',
      chunks,
      fullResponse,
      requestData,
    });

  } catch (error) {
    console.error('Direct QAnything test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
