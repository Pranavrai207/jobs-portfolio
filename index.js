/* ==========================================================================
   PORTFOLIO LOGIC - IT INFRASTRUCTURE & SUPPORT PORTFOLIO (PRANAV RAI)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
   * 1. THEME MANAGEMENT & LIGHT/DARK TOGGLE
   * --------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve theme preference from localStorage or default to dark
  const storedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', storedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Redraw routing canvas elements to adapt to background changes
    drawRouteVisualizer();
  });

  /* ---------------------------------------------------------
   * 2. RESPONSIVE MOBILE NAVIGATION MENU
   * --------------------------------------------------------- */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
  });

  // Close navigation menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
    });
  });

  /* ---------------------------------------------------------
   * 3. ACTIVE SCROLL HIGHLIGHTING (Intersection Observer)
   * --------------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies core viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  /* ---------------------------------------------------------
   * 4. LIVE METRICS SIMULATION (IT INFRASTRUCTURE HEALTH)
   * --------------------------------------------------------- */
  const latencyEl = document.getElementById('metricLatency');
  const latencyTrendEl = document.getElementById('trendLatency');
  const latencyBarEl = document.getElementById('barLatency');

  const cpuEl = document.getElementById('metricCpu');
  const cpuTrendEl = document.getElementById('trendCpu');
  const cpuBarEl = document.getElementById('barCpu');

  setInterval(() => {
    // Latency variation: baseline 40-50ms
    let latencyVal = Math.floor(Math.random() * 15) + 38;
    let cpuVal = Math.floor(Math.random() * 18) + 18;

    // Simulate occasional load peaks
    if (Math.random() > 0.85) {
      latencyVal += 25;
      cpuVal += 35;
    }

    // Update Latency DOM
    latencyEl.textContent = `${latencyVal}ms`;
    latencyBarEl.style.width = `${Math.min(latencyVal, 100)}%`;
    if (latencyVal > 60) {
      latencyTrendEl.textContent = 'Spike';
      latencyTrendEl.className = 'metric-trend text-yellow';
    } else {
      latencyTrendEl.textContent = 'Stable';
      latencyTrendEl.className = 'metric-trend text-green';
    }

    // Update CPU DOM
    cpuEl.textContent = `${cpuVal}%`;
    cpuBarEl.style.width = `${cpuVal}%`;
    if (cpuVal > 50) {
      cpuTrendEl.textContent = 'Elevated';
      cpuTrendEl.className = 'metric-trend text-yellow';
    } else {
      cpuTrendEl.textContent = 'Nominal';
      cpuTrendEl.className = 'metric-trend text-green';
    }
  }, 3000);

  /* ---------------------------------------------------------
   * 5. NETWORK ROUTE OPTIMIZER (DIJKSTRA CANVAS GRAPHICS)
   * --------------------------------------------------------- */
  const canvas = document.getElementById('routeCanvas');
  const ctx = canvas.getContext('2d');
  const recalculateBtn = document.getElementById('btnRecalculate');
  const routeText = document.getElementById('routeText');

  // Define Nodes representing simulated routers
  let nodes = {
    S: { x: 40, y: 105, label: 'Source' },
    A: { x: 140, y: 50, label: 'Router-A' },
    B: { x: 140, y: 160, label: 'Router-B' },
    C: { x: 240, y: 105, label: 'Router-C' },
    D: { x: 300, y: 105, label: 'Destination' }
  };

  // Connection edges with variable weights
  let weights = {
    SA: 5,
    SB: 9,
    AC: 4,
    BC: 3,
    CD: 3,
    AD: 10
  };

  let activePath = ['S', 'A', 'C', 'D'];
  let packetProgress = 0;

  function runDijkstraSimulation() {
    // Simulate Dijkstra recalculation by varying edge weights
    weights.SA = Math.floor(Math.random() * 6) + 3;
    weights.SB = Math.floor(Math.random() * 6) + 4;
    weights.AC = Math.floor(Math.random() * 5) + 2;
    weights.BC = Math.floor(Math.random() * 4) + 2;
    weights.CD = Math.floor(Math.random() * 4) + 1;
    weights.AD = Math.floor(Math.random() * 8) + 8;

    // Simple manual shortest path calculation for this fixed topology
    const costPath1 = weights.SA + weights.AC + weights.CD; // S -> A -> C -> D
    const costPath2 = weights.SB + weights.BC + weights.CD; // S -> B -> C -> D
    const costPath3 = weights.SA + weights.AD;              // S -> A -> D

    let minCost = costPath1;
    activePath = ['S', 'A', 'C', 'D'];

    if (costPath2 < minCost) {
      minCost = costPath2;
      activePath = ['S', 'B', 'C', 'D'];
    }
    if (costPath3 < minCost) {
      minCost = costPath3;
      activePath = ['S', 'A', 'D'];
    }

    routeText.textContent = `Dijkstra: Route ${activePath.join(' -> ')} [cost: ${minCost}]`;
    packetProgress = 0; // Restart packet travel animation
  }

  // Animation Loop for packet travel
  function drawRouteVisualizer() {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodeBg = isDark ? '#18181b' : '#f4f4f5';
    const nodeStroke = isDark ? '#3f3f46' : '#d4d4d8';
    const textMain = isDark ? '#f4f4f5' : '#09090b';
    const pathInactive = isDark ? '#27272a' : '#cbd5e1';
    const pathActive = '#2563eb'; // Tech Blue

    // Draw Edges (Connection Lines)
    function drawEdge(n1, n2, weightVal, active) {
      ctx.beginPath();
      ctx.moveTo(nodes[n1].x, nodes[n1].y);
      ctx.lineTo(nodes[n2].x, nodes[n2].y);
      ctx.strokeStyle = active ? pathActive : pathInactive;
      ctx.lineWidth = active ? 3 : 1.5;
      ctx.stroke();

      // Draw Weight label
      const midX = (nodes[n1].x + nodes[n2].x) / 2;
      const midY = (nodes[n1].y + nodes[n2].y) / 2 - 8;
      ctx.fillStyle = active ? pathActive : '#a1a1aa';
      ctx.font = 'bold 9px JetBrains Mono';
      ctx.fillText(weightVal, midX, midY);
    }

    // Helper to check if edge is active in path
    function isEdgeActive(n1, n2) {
      for (let i = 0; i < activePath.length - 1; i++) {
        if ((activePath[i] === n1 && activePath[i+1] === n2) || (activePath[i] === n2 && activePath[i+1] === n1)) {
          return true;
        }
      }
      return false;
    }

    drawEdge('S', 'A', weights.SA, isEdgeActive('S', 'A'));
    drawEdge('S', 'B', weights.SB, isEdgeActive('S', 'B'));
    drawEdge('A', 'C', weights.AC, isEdgeActive('A', 'C'));
    drawEdge('B', 'C', weights.BC, isEdgeActive('B', 'C'));
    drawEdge('C', 'D', weights.CD, isEdgeActive('C', 'D'));
    drawEdge('A', 'D', weights.AD, isEdgeActive('A', 'D'));

    // Draw Nodes
    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      
      // Outer Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI);
      ctx.fillStyle = nodeBg;
      ctx.strokeStyle = activePath.includes(key) ? pathActive : nodeStroke;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Node label text inside
      ctx.fillStyle = textMain;
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(key, node.x, node.y);

      // Label below node
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '8px Open Sans';
      ctx.fillText(node.label, node.x, node.y + 24);
    });

    // Draw traveling data packet
    animatePacket();
  }

  function animatePacket() {
    packetProgress += 0.012;
    if (packetProgress > activePath.length - 1) {
      packetProgress = 0;
    }

    const currentSegment = Math.floor(packetProgress);
    const segmentProgress = packetProgress - currentSegment;
    
    const startNodeKey = activePath[currentSegment];
    const endNodeKey = activePath[currentSegment + 1];

    if (startNodeKey && endNodeKey) {
      const nStart = nodes[startNodeKey];
      const nEnd = nodes[endNodeKey];

      // Linear interpolation coordinates
      const packetX = nStart.x + (nEnd.x - nStart.x) * segmentProgress;
      const packetY = nStart.y + (nEnd.y - nStart.y) * segmentProgress;

      ctx.beginPath();
      ctx.arc(packetX, packetY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#60a5fa'; // Light Blue glow packet
      ctx.fill();
    }
  }

  // Run initial drawing
  drawRouteVisualizer();

  // Animation Loop frame tick
  function tickAnimation() {
    drawRouteVisualizer();
    requestAnimationFrame(tickAnimation);
  }
  requestAnimationFrame(tickAnimation);

  recalculateBtn.addEventListener('click', () => {
    runDijkstraSimulation();
  });

  /* ---------------------------------------------------------
   * 6. INCIDENT QUEUE RESOLUTION TERMINAL LOGS
   * --------------------------------------------------------- */
  const terminalLogEl = document.getElementById('terminalLogOutput');
  const ticketCountEl = document.getElementById('ticketCount');
  const ticketListEl = document.getElementById('ticketList');

  // Maintain initial active tickets
  let activeTickets = [
    {
      id: 1,
      ticketCode: 'INC-0284',
      title: 'High Packet Loss on Router IP 192.168.10.4',
      severity: 'critical'
    }
  ];

  window.resolveTicket = function(ticketId) {
    const ticketIndex = activeTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) return;

    const ticket = activeTickets[ticketIndex];

    // Remove from UI list
    const ticketNode = document.getElementById(`ticket${ticketId}`);
    if (ticketNode) {
      ticketNode.style.opacity = '0';
      setTimeout(() => {
        ticketNode.remove();
      }, 300);
    }

    // Append mock processing scripts outputs
    appendTerminalLine(`[INFRA-DEB] Init connection to router-switch 192.168.10.4...`, 'text-muted');
    
    setTimeout(() => {
      appendTerminalLine(`[INFRA-DEB] Interface eth0 buffer queue saturated (Capacity at 99.4%).`, 'text-yellow');
    }, 600);

    setTimeout(() => {
      appendTerminalLine(`[INFRA-DEB] Running clear_routing_buffer.py scripts...`, 'text-muted');
    }, 1200);

    setTimeout(() => {
      appendTerminalLine(`[INFRA-DEB] Flushed interface queues. Reset link parameters.`, 'text-green');
      appendTerminalLine(`[SYSTEM] Incident ${ticket.ticketCode} marked as RESOLVED.`, 'text-green');
      
      // Update ticket count
      activeTickets = activeTickets.filter(t => t.id !== ticketId);
      ticketCountEl.textContent = activeTickets.length;
      
      if (activeTickets.length === 0) {
        ticketListEl.innerHTML = `
          <div class="font-mono text-muted text-center py-4 card-glass" style="padding: 1.5rem; text-align: center;">
            ✓ Active logs clear. 0 tickets outstanding.
          </div>
        `;
        ticketCountEl.style.backgroundColor = '#16a348';
      }
    }, 2000);
  };

  function appendTerminalLine(text, classStyle = '') {
    const line = document.createElement('p');
    line.className = `console-output-line ${classStyle}`;
    line.textContent = text;
    terminalLogEl.appendChild(line);
    // Auto-scroll terminal log to bottom
    terminalLogEl.scrollTop = terminalLogEl.scrollHeight;
  }

  /* ---------------------------------------------------------
   * 7. PROJECT FILTERING LOGIC
   * --------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterType === 'all' || cardCat === filterType) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* ---------------------------------------------------------
   * 8. CONTACT FORM SUBMISSION DIAGNOSTIC LOGGER
   * --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const company = document.getElementById('contactCompany').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    formStatus.textContent = 'INITIATING SMTP GATEWAY HANDSHAKE...';
    formStatus.className = 'form-status text-muted';

    // Simulated terminal console steps
    setTimeout(() => {
      formStatus.textContent = 'STATION CONNECTED. VALIDATING SSL CERTIFICATE...';
    }, 600);

    setTimeout(() => {
      formStatus.textContent = 'ROUTING ENVELOPE PACKETS TO MAIL RELAY GATEWAY...';
    }, 1200);

    // Call the actual FormSubmit AJAX API
    fetch("https://formsubmit.co/ajax/Pranavguru079@gmail.com", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        Name: name,
        Email: email,
        Company: company,
        Subject: subject,
        Message: message,
        _subject: `New Portfolio Inquiry: ${subject}`
      })
    })
    .then(response => {
      if (response.ok) {
        setTimeout(() => {
          formStatus.textContent = '✓ MESSAGE DELIVERED SUCCESSFULLY TO PRANAVGURU079@GMAIL.COM!';
          formStatus.className = 'form-status text-green';
          contactForm.reset();
        }, 1800);
      } else {
        throw new Error("SMTP dispatch failed");
      }
    })
    .catch(error => {
      console.error(error);
      setTimeout(() => {
        formStatus.textContent = '⚠ STACK ERROR: DIRECT EMAIL FALLBACK TRIGGERED.';
        formStatus.className = 'form-status text-red';
        
        // As a fallback, open standard mailto
        window.location.href = `mailto:Pranavguru079@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + company + ")\n\n" + message)}`;
      }, 1800);
    });
  });

});
