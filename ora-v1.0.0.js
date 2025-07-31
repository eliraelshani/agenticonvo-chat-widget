(function () {
    //const DEFAULT_CHAT_URL = "https://agenticonvo.com/ora"; // ✅ Use deployed URL in production
    const DEFAULT_CHAT_URL = "http://localhost:3000";
    const DEFAULT_ICON_URL = "https://eliraelshani.github.io/agenticonvo-chat-widget/chatlogo.png";
  
    function parseQueryParams(url) {
      const params = {};
      const queryString = url.split("?")[1];
      if (!queryString) return params;
      for (const pair of queryString.split("&")) {
        const [key, value] = pair.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
      return params;
    }
  
    function getScriptParams() {
      const currentScript = document.currentScript || [...document.scripts].pop();
      return parseQueryParams(currentScript.src || "");
    }
  
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
  
      const button = document.createElement("button");
      const icon = document.createElement("img");
      icon.src = options.icon || DEFAULT_ICON_URL;
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
          iframe.style.display = "block";
        } else {
          createIframe();
        }
      });
  
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
  
    // ✅ Auto-run on load if site_id is passed in script tag
    window.addEventListener("DOMContentLoaded", () => {
      const params = getScriptParams();
      if (params.site_id) {
        window.initOraChat(params.site_id, { lang: params.lang || "en" });
      }
    });
  })();
  