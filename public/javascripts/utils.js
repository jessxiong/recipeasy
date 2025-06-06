
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

async function displayError(){
    document.getElementById('errorInfo').innerText = 'Error: action failed (see console for more information)'

    await new Promise(resolve => setTimeout(resolve, 4 * 1000))
    document.getElementById('errorInfo').innerText= ''
}