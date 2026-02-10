export function normalizeUrl(inputUrl){
    if(!inputUrl) return null
    let url=inputUrl.trim()

    if(!url.startsWith("http://")&& !url.startsWith("https://")){
        url="https://"+url
    }

    try {
        const parsedUrl= new URL(url)
        let hostname=parsedUrl.hostname.replace(/^www\./,"")
        let pathname=parsedUrl.pathname.replace(/\/$/,"")
        return `https://${hostname}${pathname}`
    } catch (error) {
        return null
    }
}