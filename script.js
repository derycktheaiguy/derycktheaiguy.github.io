/* Horizon Hub Media - Main Logic
   Author: Co-authored by Deryck, Claude, and Gemini
*/

// --- Privacy Policy Modal Logic ---

function showPrivacyPolicy() {
    document.getElementById('privacyModal').style.display = 'block';
}

function closePrivacyPolicy() {
    document.getElementById('privacyModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('privacyModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// --- Internal Tools / Password Protection ---

function showPasswordPrompt() {
    const password = prompt("Enter Horizon Hub Access Code:");
    
    // Password is: horizon2025
    if (password === "horizon2025") {
        const toolSection = document.getElementById('discoveryFormSection');
        toolSection.classList.remove('hidden');
        toolSection.scrollIntoView({ behavior: 'smooth' });
        loadSavedDraft();
    } else if (password !== null) {
        alert("Access Denied. Incorrect Code.");
    }
}

// --- Discovery Form Logic (SMART VERSION) ---

// 1. Save Draft (Captures ALL fields automatically)
function saveDiscoveryForm() {
    const form = document.getElementById('discoveryForm');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to a standard object so we can save it
    formData.forEach((value, key) => {
        data[key] = value;
    });

    data.timestamp = new Date().toLocaleString();
    localStorage.setItem('horizonDiscoveryDraft', JSON.stringify(data));
    alert("Draft saved to browser storage!");
}

// 2. Load Draft
function loadSavedDraft() {
    const savedData = localStorage.getItem('horizonDiscoveryDraft');
    if (savedData) {
        const data = JSON.parse(savedData);
        const form = document.getElementById('discoveryForm');
        
        // Loop through saved data and repopulate fields
        Object.keys(data).forEach(key => {
            const field = form.elements[key];
            if (field) {
                if(field.type === 'checkbox') {
                    field.checked = true; 
                } else {
                    field.value = data[key];
                }
            }
        });
    }
}

// 3. Export to JSON (Downloads file)
function exportDiscoveryForm() {
    const form = document.getElementById('discoveryForm');
    const formData = new FormData(form);
    
    // Convert the form data into a neat list
    const exportData = Object.fromEntries(formData.entries());
    
    // Add a timestamp
    exportData.exportedAt = new Date().toISOString();

    // Create the JSON file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    
    // Generate filename based on Company Name (or default to 'Client')
    const fileName = "Discovery_" + (exportData.company || "Client").replace(/\s+/g, '_') + ".json";

    // Trigger the download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// 4. Clear Form
function clearDiscoveryForm() {
    if(confirm("Are you sure? This will clear the form and delete the local draft.")) {
        document.getElementById('discoveryForm').reset();
        localStorage.removeItem('horizonDiscoveryDraft');
    }
}

// Close modals on 'Escape' key press
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closePrivacyPolicy();
    }
});
