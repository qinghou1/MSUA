
/* Enlarge original project figures; retain keyboard focus on close. */
(function(){
  'use strict';
  const dialog=document.getElementById('project-figure-dialog');
  const close=document.getElementById('project-figure-close');
  const image=document.getElementById('project-figure-image');
  const title=document.getElementById('project-figure-dialog-title');
  const caption=document.getElementById('project-figure-caption');
  let opener=null;
  document.querySelectorAll('[data-project-figure]').forEach(function(button){
    button.addEventListener('click',function(){
      const source=button.querySelector('img');if(!source)return;
      opener=button;image.src=source.currentSrc||source.src;image.alt=source.alt;
      title.textContent=button.dataset.figureTitle;caption.textContent=button.dataset.figureCaption;
      document.body.classList.add('figure-open');dialog.showModal();close.focus();
    });
  });
  close.addEventListener('click',function(){dialog.close();});
  dialog.addEventListener('close',function(){document.body.classList.remove('figure-open');if(opener)opener.focus({preventScroll:true});});
  dialog.addEventListener('click',function(event){if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
})();
