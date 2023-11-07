import * as process from 'process'

export const SUMMARIZE_PROMPT = 'Summarize the prompt in around 40 characters for English, and 15 characters for Japanese. You only have to output the result in the appropriate language (If English was provided, then output in English, and do NOT output Japanese). Provide only one summary, and do not provide more than one summary.'

export const apiUrl = (path: string) => {
  if (process.env.NODE_ENV === 'production') {
    return `/api/${path}`
  } else {
    return `http://localhost:8080/${path}`
  }
}

export const filterContent = (content: string) => {
  if ((content.match(/```/g) || []).length % 2 === 1) {
    content += '\n```'
  }
  return content
}

export async function fileToBase64DataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result as string),
      onerror: () => reject(reader.error),
    });
    reader.readAsDataURL(file);
  });
}
