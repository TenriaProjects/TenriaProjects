
console.log('[Renderer] Script loaded');
console.log('[Renderer] window.api available?', typeof window.api);
console.log('[Renderer] window.api contents:', window.api);

// Rest of your renderer.js code...// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Clock
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}`;
}
updateTime();
setInterval(updateTime, 1000);

// Check login status on load
async function checkLoginStatus() {
  try {
    const loggedIn = await window.api.isLoggedIn();
    if (loggedIn) {
      const user = await window.api.getCurrentUser();
      document.getElementById('login').classList.add('hidden');
      document.getElementById('logout').classList.remove('hidden');
      document.getElementById('regionSelect').disabled = false;
      document.getElementById('launch').disabled = false;
      console.log('User logged in:', user);
    }
  } catch (error) {
    console.error('Error checking login status:', error);
  }
}
checkLoginStatus();

// Login button
document.getElementById('login').addEventListener('click', async () => {
  try {
    const user = await window.api.login();
    console.log('Logged in:', user);
    document.getElementById('login').classList.add('hidden');
    document.getElementById('logout').classList.remove('hidden');
    document.getElementById('regionSelect').disabled = false;
    document.getElementById('launch').disabled = false;
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please try again.');
  }
});

// Logout button
document.getElementById('logout').addEventListener('click', async () => {
  try {
    await window.api.logout();
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('logout').classList.add('hidden');
    document.getElementById('regionSelect').disabled = true;
    document.getElementById('launch').disabled = true;
  } catch (error) {
    console.error('Logout failed:', error);
  }
});

// Launch button
document.getElementById('launch').addEventListener('click', async () => {
  const serverAddress = document.getElementById('regionSelect').value;
  const launchBtn = document.getElementById('launch');
  
  launchBtn.disabled = true;
  launchBtn.textContent = 'Launching...';
  
  try {
    await window.api.launch(serverAddress);
    launchBtn.textContent = 'Play Tenria';
    launchBtn.disabled = false;
  } catch (error) {
    console.error('Launch failed:', error);
    alert('Failed to launch Minecraft. Check console for details.');
    launchBtn.textContent = 'Play Tenria';
    launchBtn.disabled = false;
  }
});

// Mod installation handlers
async function checkModStatuses() {
  try {
    const fabricInstalled = await window.api.checkFabricInstalled();
    if (fabricInstalled) {
      document.getElementById('fabric-status').textContent = 'Installed';
      document.getElementById('fabric-status').classList.remove('not-installed');
      document.getElementById('fabric-status').classList.add('installed');
      document.getElementById('install-fabric').textContent = 'Reinstall';
      
      // Enable other mod buttons
      document.getElementById('install-fabric-api').disabled = false;
      document.getElementById('install-modmenu').disabled = false;
      document.getElementById('install-sodium').disabled = false;
    }
    
    // Check individual mods
    const mods = ['fabric-api', 'modmenu', 'sodium'];
    for (const mod of mods) {
      const installed = await window.api.checkModInstalled(mod);
      if (installed) {
        document.getElementById(`${mod}-status`).textContent = 'Installed';
        document.getElementById(`${mod}-status`).classList.remove('not-installed');
        document.getElementById(`${mod}-status`).classList.add('installed');
        document.getElementById(`install-${mod}`).textContent = 'Reinstall';
      }
    }
  } catch (error) {
    console.error('Error checking mod statuses:', error);
  }
}
checkModStatuses();

document.getElementById('install-fabric').addEventListener('click', async () => {
  const btn = document.getElementById('install-fabric');
  btn.disabled = true;
  btn.textContent = 'Installing...';
  
  try {
    await window.api.installFabric();
    document.getElementById('fabric-status').textContent = 'Installed';
    document.getElementById('fabric-status').classList.remove('not-installed');
    document.getElementById('fabric-status').classList.add('installed');
    btn.textContent = 'Reinstall';
    
    // Enable other mod buttons
    document.getElementById('install-fabric-api').disabled = false;
    document.getElementById('install-modmenu').disabled = false;
    document.getElementById('install-sodium').disabled = false;
  } catch (error) {
    console.error('Fabric installation failed:', error);
    alert('Failed to install Fabric. Check console for details.');
    btn.textContent = 'Download & Install';
  } finally {
    btn.disabled = false;
  }
});

// Fabric API
document.getElementById('install-fabric-api').addEventListener('click', async () => {
  const btn = document.getElementById('install-fabric-api');
  btn.disabled = true;
  btn.textContent = 'Installing...';
  
  try {
    await window.api.installMod('fabric-api');
    document.getElementById('fabric-api-status').textContent = 'Installed';
    document.getElementById('fabric-api-status').classList.remove('not-installed');
    document.getElementById('fabric-api-status').classList.add('installed');
    btn.textContent = 'Reinstall';
  } catch (error) {
    console.error('Fabric API installation failed:', error);
    alert('Failed to install Fabric API. Check console for details.');
    btn.textContent = 'Download & Install';
  } finally {
    btn.disabled = false;
  }
});

// Mod Menu
document.getElementById('install-modmenu').addEventListener('click', async () => {
  const btn = document.getElementById('install-modmenu');
  btn.disabled = true;
  btn.textContent = 'Installing...';
  
  try {
    await window.api.installMod('modmenu');
    document.getElementById('modmenu-status').textContent = 'Installed';
    document.getElementById('modmenu-status').classList.remove('not-installed');
    document.getElementById('modmenu-status').classList.add('installed');
    btn.textContent = 'Reinstall';
  } catch (error) {
    console.error('Mod Menu installation failed:', error);
    alert('Failed to install Mod Menu. Check console for details.');
    btn.textContent = 'Download & Install';
  } finally {
    btn.disabled = false;
  }
});

// Sodium
document.getElementById('install-sodium').addEventListener('click', async () => {
  const btn = document.getElementById('install-sodium');
  btn.disabled = true;
  btn.textContent = 'Installing...';
  
  try {
    await window.api.installMod('sodium');
    document.getElementById('sodium-status').textContent = 'Installed';
    document.getElementById('sodium-status').classList.remove('not-installed');
    document.getElementById('sodium-status').classList.add('installed');
    btn.textContent = 'Reinstall';
  } catch (error) {
    console.error('Sodium installation failed:', error);
    alert('Failed to install Sodium. Check console for details.');
    btn.textContent = 'Download & Install';
  } finally {
    btn.disabled = false;
  }
});

// Fetch and display content
async function loadContent() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/TenriaProjects/TenriaProjects/main/Launcher/latest/content.json');
    const data = await response.json();
    
    // Load News
    const newsContainer = document.getElementById('news-container');
    if (data.news && data.news.length > 0) {
      newsContainer.innerHTML = data.news.map(item => `
        <div class="card">
          ${item.image ? `<img src="${item.image}" class="card-image" alt="${item.title}">` : ''}
          <div class="card-content">
            <div class="card-title">${item.title}</div>
            <div class="card-date">${new Date(item.date).toLocaleDateString()}</div>
            <div class="card-description">${item.description}</div>
            ${item.link ? `<a href="#" class="card-link" onclick="window.api.openExternal('${item.link}'); return false;">Read More</a>` : ''}
          </div>
        </div>
      `).join('');
    } else {
      newsContainer.innerHTML = '<div class="empty-state">No news at the moment</div>';
    }
    
    // Load Events
    const eventsContainer = document.getElementById('events-container');
    if (data.events && data.events.length > 0) {
      eventsContainer.innerHTML = data.events.map(item => `
        <div class="card">
          ${item.image ? `<img src="${item.image}" class="card-image" alt="${item.name}">` : ''}
          <div class="card-content">
            <span class="event-badge ${item.active ? 'active' : ''}">${item.active ? 'Active Now' : 'Upcoming'}</span>
            <div class="card-title">${item.name}</div>
            <div class="card-date">${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}</div>
            <div class="card-description">${item.description}</div>
          </div>
        </div>
      `).join('');
    } else {
      eventsContainer.innerHTML = '<div class="empty-state">No active events</div>';
    }
    
    // Load Store
    const storeContainer = document.getElementById('store-container');
    if (data.store && data.store.length > 0) {
      storeContainer.innerHTML = data.store.map(item => `
        <div class="card">
          ${item.image ? `<img src="${item.image}" class="card-image" alt="${item.name}">` : ''}
          <div class="card-content">
            <div class="card-title">${item.name}</div>
            <div class="price-tag">${item.price}</div>
            <div class="card-description">${item.description}</div>
            <a href="#" class="card-link" onclick="window.api.openExternal('${item.link}'); return false;">Purchase</a>
          </div>
        </div>
      `).join('');
    } else {
      storeContainer.innerHTML = '<div class="empty-state">Store coming soon</div>';
    }
    
  } catch (error) {
    console.error('Failed to load content:', error);
    document.getElementById('news-container').innerHTML = '<div class="empty-state">Failed to load news</div>';
    document.getElementById('events-container').innerHTML = '<div class="empty-state">Failed to load events</div>';
    document.getElementById('store-container').innerHTML = '<div class="empty-state">Failed to load store</div>';
  }
}

// Call on page load
loadContent();
