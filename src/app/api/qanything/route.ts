import { NextRequest, NextResponse } from 'next/server';
import { qAnythingService } from '@/services/qanything';
import { QAnythingChatRequest } from '@/types';

// POST /api/qanything - 发送聊天消息
export async function POST(request: NextRequest) {
  try {
    const body: QAnythingChatRequest = await request.json();

    // 验证请求参数
    const validation = qAnythingService.validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const response = await qAnythingService.chat(body);

    if (response.success) {
      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        response,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('QAnything API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET /api/qanything - 获取模型信息或检查连接
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'models';

    switch (action) {
      case 'models':
        const models = qAnythingService.getAvailableModels();
        return NextResponse.json({
          success: true,
          data: models,
        });

      case 'check':
        const connectionResult = await qAnythingService.checkConnection();
        return NextResponse.json(connectionResult);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('QAnything API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
