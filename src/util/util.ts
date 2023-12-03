import * as process from 'process'
import {TextItem, TypedArray} from "pdfjs-dist/types/src/display/api";
import {getDocument, GlobalWorkerOptions} from "pdfjs-dist";

export const apiUrl = (path: string) => {
  if (process.env.NODE_ENV === 'production') {
    return `/api/${path}`
  } else {
    return `http://localhost:8787/api/${path}`
  }
}

export const summarize = async (input: string): Promise<string> => {
  const response = await fetch(apiUrl('summarize'), {
    method: 'POST',
    body: input,
    credentials: 'include',
  })
  if (!response.ok) {
    return input
  }
  return await response.text()
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

export const convertPdfToText = async (urlOrData: string | ArrayBuffer | TypedArray) => {
  GlobalWorkerOptions.workerSrc = await import('pdfjs-dist/build/pdf.worker.min.mjs')
  const pdf = getDocument(urlOrData)
  let pdf1 = await pdf.promise;
  const maxPages = pdf1.numPages
  const promises = []
  for (let i = 1; i <= maxPages; i++) {
    const page = pdf1.getPage(i)
    promises.push(page.then(async (page) => {
      const text = await page.getTextContent()
      return text.items.map(s => (s as TextItem).str).join('')
    }))
  }
  let texts = await Promise.all(promises);
  return texts.join('');
}
