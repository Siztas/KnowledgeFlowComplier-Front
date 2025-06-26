import os
import json

BASE_URL = "http://localhost:3000/papers"
ROOT_DIR = "papers"

def extract_title_content_summary(brief_path):
    with open(brief_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    lines = [line.rstrip('\n') for line in lines]
    title = "未命名论文"
    content = ""
    summary = ""

    # 提取标题（第一行必须以 ### 开头）
    if lines and lines[0].strip().startswith('###'):
        title = lines[0].strip().lstrip('#').strip()
        content = '\n'.join(lines)
    else:
        content = '\n'.join(lines)

    # 提取 summary（跳过第一行标题后，找到第一段非空内容）
    body_lines = lines[1:] if lines and lines[0].strip().startswith('###') else lines
    paragraph = []
    for line in body_lines:
        if line.strip():
            paragraph.append(line.strip())
        elif paragraph:
            break
    if paragraph:
        summary = ''.join(paragraph)

    return title, content, summary

def generate_mock_article(arxiv_id, title, content, summary, idx):
    return {
        "id": str(idx),
        "title": title,
        "content": content,
        "summary": summary,
        "authors": [],
        "tags": [],
        "publishedAt": "",
        "imageUrl": f"{BASE_URL}/{arxiv_id}/images/image_1.png",
        "views": 0,
        "citations": 0,
        "popularityScore": 0
    }

def escape_ts_string(value):
    return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n")

def main():
    articles = []
    index = 1

    for arxiv_id in sorted(os.listdir(ROOT_DIR)):
        paper_dir = os.path.join(ROOT_DIR, arxiv_id)
        if not os.path.isdir(paper_dir):
            continue
        brief_path = os.path.join(paper_dir, "brief.txt")
        if not os.path.exists(brief_path):
            continue

        title, content, summary = extract_title_content_summary(brief_path)
        article = generate_mock_article(arxiv_id, title, content, summary, index)
        articles.append(article)
        index += 1

    with open("mock.ts", "w", encoding="utf-8") as f:
        f.write("// 模拟文章数据\n")
        f.write("export const mockArticles: ExtendedArticle[] = [\n")
        for article in articles:
            f.write("  {\n")
            for key, value in article.items():
                if isinstance(value, str):
                    f.write(f'    {key}: "{escape_ts_string(value)}",\n')
                elif isinstance(value, list):
                    f.write(f'    {key}: {json.dumps(value, ensure_ascii=False)},\n')
                else:
                    f.write(f'    {key}: {value},\n')
            f.write("  },\n")
        f.write("];\n")

if __name__ == "__main__":
    main()
