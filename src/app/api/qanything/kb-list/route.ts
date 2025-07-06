import { NextResponse } from 'next/server';

// GET /api/qanything/kb-list - 获取知识库列表
export async function GET() {
  try {
    const apiKey = process.env.QANYTHING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'QAnything API Key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openapi.youdao.com/q_anything/api/kb_list', {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to fetch knowledge bases: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (data.errorCode != 0) {
      return NextResponse.json(
        { success: false, error: data.msg || 'Failed to fetch knowledge bases' },
        { status: 500 }
      );
    }

    // 为每个知识库获取状态信息
    const knowledgeBasesWithStatus = await Promise.all(
      (data.result || []).map(async (kb: {kbId: string; kbName: string}) => {
        try {
          // 查询FAQ列表来判断知识库状态
          const faqResponse = await fetch(`https://openapi.youdao.com/q_anything/api/faq_list?kbId=${kb.kbId}&pageSize=1`, {
            method: 'GET',
            headers: {
              'Authorization': apiKey,
            },
          });

          let status = 0; // 默认状态：空知识库
          if (faqResponse.ok) {
            const faqData = await faqResponse.json();
            if (faqData.errorCode == 0 && faqData.result?.faqList?.length > 0) {
              // 检查是否有已处理完成的FAQ
              const processedFAQs = faqData.result.faqList.filter((faq: {status: number}) => faq.status === 1);
              status = processedFAQs.length > 0 ? 1 : 0; // 1: 有可用内容, 0: 处理中或空
            }
          }

          return {
            kbId: kb.kbId,
            kbName: kb.kbName,
            status,
          };
        } catch (error) {
          console.error(`Failed to get status for KB ${kb.kbId}:`, error);
          return {
            kbId: kb.kbId,
            kbName: kb.kbName,
            status: 0, // 默认状态
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      knowledgeBases: knowledgeBasesWithStatus,
    });

  } catch (error) {
    console.error('Knowledge base list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
