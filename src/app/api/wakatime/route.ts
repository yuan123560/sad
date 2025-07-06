import { NextRequest, NextResponse } from 'next/server';
import { wakaTimeService } from '@/services/wakatime';

// GET /api/wakatime - 获取WakaTime统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all_time';
    const range = searchParams.get('range') || 'last_7_days';

    let response;

    switch (type) {
      case 'all_time':
        response = await wakaTimeService.getAllTimeStats();
        break;
      case 'today':
        response = await wakaTimeService.getTodaySummary();
        break;
      case 'stats':
        response = await wakaTimeService.getStats(range);
        break;
      case 'check':
        response = await wakaTimeService.checkConnection();
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    if (response.success) {
      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        response,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('WakaTime API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
