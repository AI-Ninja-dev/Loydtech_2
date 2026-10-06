(() => {
  const MEASUREMENT_ID = (window.LOYDTECH_GA_ID || '').trim();
  const isConfigured = /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID) && MEASUREMENT_ID !== 'G-XXXXXXXXXX';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  if (isConfigured && !document.querySelector('script[data-loydtech-ga4]')) {
    const s=document.createElement('script');
    s.async=true; s.dataset.loydtechGa4='true';
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, { anonymize_ip:true, send_page_view:true });
  }

  const send=(name,params={})=>{
    if(!isConfigured) return;
    window.gtag('event',name,{...params,page_location:location.href,page_title:document.title});
  };

  document.addEventListener('click',(event)=>{
    const a=event.target.closest('a');
    if(!a) return;
    const href=(a.getAttribute('href')||'').trim();
    const text=(a.textContent||'').replace(/\s+/g,' ').trim().slice(0,120);
    const combined=(href+' '+text).toLowerCase();
    let name=null;
    if (/mailto:|start a conversation|book a demo|contact/.test(combined)) name='lead_enquiry';
    else if (/sentinel 365|platform/.test(combined)) name='sentinel365_interest';
    else if (/rtls|asset tracking/.test(combined)) name='rtls_interest';
    else if (/remote monitoring|cold chain|iot/.test(combined)) name='solution_interest';
    else if (/security|compliance/.test(combined)) name='security_interest';
    if(name) send(name,{link_text:text,link_url:href});
  },{passive:true});

  window.LoydtechAnalytics={ event:send };
})();