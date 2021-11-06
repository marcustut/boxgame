import { supabase } from '@/lib/supabase'

export const bulkUploadFilesToSupabase = async (
  files: File[],
  bucketName: string,
  bucketPath: string,
  options?: {
    cacheControl?: string
    contentType?: string
    upsert?: boolean
  }
): Promise<{ publicURLs: string[] | null; error: Error | null }> => {
  const publicURLs: string[] = []

  for (let i = 0; i < files.length; i++) {
    const { error: uploadErr } = await supabase.storage
      .from(bucketName)
      .upload(`${bucketPath}/${files[i].name}`, files[i], options)
    if (uploadErr) {
      console.error(uploadErr)
      return { publicURLs: null, error: uploadErr }
    }
    const { publicURL, error: getURLErr } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${bucketPath}/${files[i].name}`)
    if (getURLErr || !publicURL) {
      console.error(getURLErr)
      return { publicURLs: null, error: getURLErr }
    }
    publicURLs.push(publicURL)
  }

  return { publicURLs, error: null }
}
