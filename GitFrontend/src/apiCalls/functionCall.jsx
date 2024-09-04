import React from 'react'

async function functionCall(file) {
    if (!file) {
        setError('Please select a file to upload.');
        return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://phisingfunction.azurewebsites.net/', { // Replace with your Azure Function URL
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
    } catch (error) {
        setError(`Failed to upload file: ${error.message}`);
    } finally {
        setLoading(false);
    }
}
export default functionCall