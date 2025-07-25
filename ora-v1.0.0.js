(function () {
    const DEFAULT_CHAT_URL = "http://localhost:3000";
    //const DEFAULT_CHAT_URL = "https://agenticonvo.com/ora";

  
    window.initOraChat = function (siteId, options = {}) {
      const lang = options.lang || "en";
      const iframeId = "ora-chat-iframe";
      const chatUrl = `${DEFAULT_CHAT_URL}?site_id=${encodeURIComponent(siteId)}&lang=${encodeURIComponent(lang)}`;
  
      const createIframe = () => {
        const iframe = document.createElement("iframe");
        iframe.id = iframeId;
        iframe.src = chatUrl;
        iframe.setAttribute("scrolling", "no");
  
        iframe.style = `
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 360px;
          height: 502px;
          border: none;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 16px rgba(0,0,0,0.25);
          display: block;
          z-index: 9998;
        `;
        document.body.appendChild(iframe);
      };
  
      // Create floating chat button
      const button = document.createElement("button");
      const icon = document.createElement("img");
      icon.src = options.icon || "https://eliraelshani.github.io/agenticonvo-chat-widget/chatlogo.png";
      icon.alt = "Chat Icon";
      icon.style = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        border-radius: 50%;
      `;
      
      button.appendChild(icon);
            button.title = "Chat with Ora";
      button.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background-color: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 24px;
        z-index: 9999;
        cursor: pointer;
      `;
      document.body.appendChild(button);
  
      button.addEventListener("click", () => {
        const iframe = document.getElementById(iframeId);
        if (iframe) {
          iframe.style.display = "block"; // Restore minimized iframe
        } else {
          createIframe(); // Create new one if exited
        }
      });
  
      // Listen for postMessage events
      window.addEventListener("message", (event) => {
        if (!event.data || typeof event.data.type !== "string") return;
  
        const chatFrame = document.getElementById(iframeId);
  
        if (event.data.type === "ORA_MINIMIZE" && chatFrame) {
          chatFrame.style.display = "none";
        }
  
        if (event.data.type === "ORA_CLOSE" && chatFrame) {
          chatFrame.remove();
        }
      });
    };
  })();
  