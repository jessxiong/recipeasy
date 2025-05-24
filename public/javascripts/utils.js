
const escapeHTML = str => !str ? str : str.replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));

async function fetchJSON(route, options) {
    const response = await fetch(route, {
        method: options?.method || "GET",
        headers: { 'Content-Type': 'application/json' },
        body: options?.body ? JSON.stringify(options.body) : undefined
    });
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        throw new Error('Server error occurred');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }
    
    return data;
}

// async function fetchJSON(route, options){
//     let response
//     try{
//         response = await fetch(route, {
//             method: options && options.method ? options.method : "GET",
//             body: options && options.body ? JSON.stringify(options.body) : undefined,
//             headers: options && options.body ? {'Content-Type': 'application/json'}: undefined
//         })
//     }catch(error){
//         displayError()
//         throw new Error(
//             `Error fetching ${route} with options: ${options ? JSON.stringify(options) : options}
//              No response from server (failed to fetch)`)
//     }
//     let responseJson;
//     try{
//         responseJson = await response.json();
//     }catch(error){
//         try{
//             let responseText = await response.text();
//         }catch(getTextError){
//             displayError()
//             throw new Error(
//                 `Error fetching ${route} with options: ${options ? JSON.stringify(options) : options}
//                 Status: ${response.status}
//                 Couldn't get response body
//                 error: ${getTextError}`)
//         }
//         displayError()
//         throw new Error(
//             `Error fetching ${route} with options: ${options ? JSON.stringify(options) : options}
//             Status: ${response.status}
//             Response wasn't json: ${responseText ? JSON.stringify(responseText) : responseText}
//             error: ${getTextError}`)
//     }
//     if(response.status < 200 || response.status >= 300 || responseJson.status == "error"){
//         displayError()
//         throw new Error(
//             `Error fetching ${route} with options: ${options ? JSON.stringify(options) : options}
//             Status: ${response.status}
//             Response: ${responseJson ? JSON.stringify(responseJson) : responseJson}`)
//     }
//     return responseJson
// }

async function displayError(){
    document.getElementById('errorInfo').innerText = 'Error: action failed (see console for more information)'

    await new Promise(resolve => setTimeout(resolve, 4 * 1000))
    document.getElementById('errorInfo').innerText= ''
}