
// Lightbox
const lb = document.querySelector('.lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const src = el.getAttribute('data-lightbox');
      lbImg.src = src;
      lb.classList.add('open');
    });
  });
  lb.addEventListener('click', ()=> lb.classList.remove('open'));
}

// Booking flow (single-page steps)
const booking = document.querySelector('[data-booking]');
if (booking) {
  const steps = Array.from(document.querySelectorAll('[data-step]'));
  const previewImg = document.querySelector('[data-step-preview]');
  const previewCap = document.querySelector('[data-step-caption]');
  const chips = Array.from(document.querySelectorAll('[data-chip]'));
  const nextBtn = document.querySelector('[data-next]');
  const backBtn = document.querySelector('[data-back]');
  const doneBtn = document.querySelector('[data-done]');
  let i = 0;

  function sync(){
    // update right-side preview image
    const panel = steps[i];
    if (previewImg && panel?.dataset?.stepImage) previewImg.src = panel.dataset.stepImage;
    if (previewCap && panel?.dataset?.stepCap) previewCap.textContent = panel.dataset.stepCap;

    steps.forEach((s, idx)=> s.style.display = (idx===i ? 'block' : 'none'));
    chips.forEach((c, idx)=> c.classList.toggle('active', idx===i));
    backBtn.style.display = i===0 ? 'none' : 'inline-flex';
    nextBtn.style.display = i===steps.length-1 ? 'none' : 'inline-flex';
    doneBtn.style.display = i===steps.length-1 ? 'inline-flex' : 'none';
  }

  function validateCurrent(){
    const panel = steps[i];
    const required = panel.querySelectorAll('[required]');
    for (const el of required){
      if (!el.value){
        el.focus();
        el.classList.add('shake');
        setTimeout(()=>el.classList.remove('shake'), 300);
        return false;
      }
    }
    return true;
  }

  nextBtn?.addEventListener('click', ()=>{
    if (!validateCurrent()) return;
    i = Math.min(i+1, steps.length-1);
    sync();
  });

  backBtn?.addEventListener('click', ()=>{
    i = Math.max(i-1, 0);
    sync();
  });

  doneBtn?.addEventListener('click', ()=>{
    if (!validateCurrent()) return;

    // collect summary
    const get = (id)=> document.getElementById(id)?.value || "";
    const addons = Array.from(document.querySelectorAll('input[name="addons"]:checked')).map(x=>x.value).join(", ");
    const summary = {
      city: get("city"),
      date: get("date"),
      time: get("time"),
      room: get("room"),
      hours: get("hours"),
      addons: addons || "None",
      name: get("name"),
      phone: get("phone"),
      note: get("note"),
      payment: "Dummy (coming soon)"
    };
    const box = document.querySelector('[data-summary]');
    box.textContent = JSON.stringify(summary, null, 2);
    document.querySelector('[data-complete]').style.display = 'block';
    window.scrollTo({top:0, behavior:"smooth"});
  });

  sync();
}
