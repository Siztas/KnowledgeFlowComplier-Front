/**
 * KnowledgeFlowCompiler 运行指南
 * 
 * 本文件提供了如何运行和测试前后端API适配的步骤。
 * 注意：这不是一个实际的代码文件，仅用于文档目的。
 */

/**
 * 环境设置
 * 
 * 1. 在项目根目录创建.env.local文件，添加以下内容:
 * 
 * ```
 * # API 基础URL
 * NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
 * 
 * # 开发环境设置
 * NEXT_PUBLIC_USE_MOCK_DATA=true
 * NEXT_PUBLIC_USE_MOCK_SERVICE=true
 * 
 * # 部署环境
 * NODE_ENV=development
 * ```
 * 
 * 2. 如果要连接到实际的后端API，将NEXT_PUBLIC_USE_MOCK_DATA和NEXT_PUBLIC_USE_MOCK_SERVICE设置为false
 */

/**
 * 运行开发服务器
 * 
 * 在项目根目录下运行:
 * ```
 * cd kfc-web
 * npm run dev
 * ```
 * 
 * 然后在浏览器中访问 http://localhost:3000
 */

/**
 * 功能测试
 * 
 * 1. API适配测试:
 *    - 打开浏览器控制台，查看初始化日志
 *    - 确认环境配置是否正确显示
 *    - 检查是否有任何错误
 * 
 * 2. RAG功能测试:
 *    - 将一些文章添加到书架中
 *    - 打开RAG模式（点击左上角的展开按钮）
 *    - 输入查询，测试响应是否正确
 * 
 * 3. API连接测试（需要后端服务）:
 *    - 修改.env.local中的NEXT_PUBLIC_USE_MOCK_DATA和NEXT_PUBLIC_USE_MOCK_SERVICE为false
 *    - 重启开发服务器并尝试进行操作
 *    - 检查API请求是否正确发送和处理
 */

/**
 * 提交更改
 * 
 * 在完成测试后，提交你的更改:
 * ```
 * git add .
 * git commit -m "实现前后端API适配"
 * git push
 * ```
 */

// 这是一个文档文件，不包含实际运行的代码 