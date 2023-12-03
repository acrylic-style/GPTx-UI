import * as process from 'process'

export const apiUrl = (path: string) => {
  if (process.env.NODE_ENV === 'production') {
    // TODO: replace with env var?
    return `https://gptx.acrylicstyle.xyz/api/${path}`
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

export const convertPdfToText = async (urlOrData: string | ArrayBuffer) => {
  const {getDocument, GlobalWorkerOptions} = await import("pdfjs-dist")
  GlobalWorkerOptions.workerSrc = await import('pdfjs-dist/build/pdf.worker.min.mjs')
  const pdf = getDocument(urlOrData)
  let pdf1 = await pdf.promise;
  const maxPages = pdf1.numPages
  const promises = []
  for (let i = 1; i <= maxPages; i++) {
    const page = pdf1.getPage(i)
    promises.push(page.then(async (page) => {
      const text = await page.getTextContent()
      return text.items.map(s => s.str).join('')
    }))
  }
  let texts = await Promise.all(promises);
  return texts.join('');
}

export const getDataTypeFromDataURI = (dataURI: string): string =>
  dataURI.split(',')[0].split(':')[1].split(';')[0]

export const dataURItoFile = (dataURI: string, filename: string): File => {
  // let byteString: string
  // if (dataURI.split(',')[0].indexOf('base64') >= 0)
  //   byteString = atob(dataURI.split(',')[1])
  // else
  //   byteString = decodeURI(dataURI.split(',')[1])
  const byteString = atob(dataURI.split(',')[1])

  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new File([ia], filename, {type: getDataTypeFromDataURI(dataURI)})
}
