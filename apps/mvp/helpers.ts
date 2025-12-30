export function getTextColor(status: string){
    let textColor = '';

    switch(status){
        case "APPLIED":
            textColor = 'text-black';
            break;
        case "REJECTED":
            textColor = "text-red-500";
            break;
        case "INTERVIEW":
            textColor = "text-green-500"
            break;
    };  

    return textColor;
}

export function getBadgeLightColor(status: string){
  let badgeColor = '';

  switch(status){
    case "APPLIED":
      badgeColor="bg-applied text-blue-700";
      break;
    case "REJECTED":
      badgeColor="bg-rejected text-red-700";
      break;
    case "INTERVIEW":
      badgeColor = "bg-interview text-purple-700"
      break;
    case "OFFER":
      badgeColor = "bg-green-100 text-green-700"
  }

  return badgeColor;
}

export function sanitizeLabColors(root: HTMLElement = document.body) {
    const fallbackBackground = '#f4f4f5'; 
    const fallbackText = '#1f2937';      
    const fallbackBorder = '#d1d5db';     
    const fallbackShadow = 'none';        
  
    const allElements = root.querySelectorAll<HTMLElement>('*');
  
    allElements.forEach(el => {
      const styles = getComputedStyle(el);
  
      for (const prop of styles) {
        const value = styles.getPropertyValue(prop);
        if (value.includes('lab(')) {
          let safeColor = '#000';
  
          if (prop.includes('background')) safeColor = el.tagName === 'button' ? 'black' : fallbackBackground;
          else if (prop === 'color' || prop.includes('text') || prop.includes('fill')) safeColor = fallbackText;
          else if (prop.includes('border')) safeColor = fallbackBorder;
          else if (prop.includes('shadow')) safeColor = fallbackShadow;
  
          try {
            el.style.setProperty(prop, safeColor);
          } catch (err) {
            console.warn(`Cannot override ${prop} on`, el);
          }
        }
      }
  
      // Sanitize pseudo-elements
      ['::before', '::after'].forEach(pseudo => {
        const pseudoStyles = getComputedStyle(el, pseudo);
        for (const prop of pseudoStyles) {
          const value = pseudoStyles.getPropertyValue(prop);
          if (value.includes('lab(')) {
            let safeColor = '#000';
  
            if (prop.includes('background')) safeColor = fallbackBackground;
            else if (prop === 'color' || prop.includes('text') || prop.includes('fill')) safeColor = fallbackText;
            else if (prop.includes('border')) safeColor = fallbackBorder;
            else if (prop.includes('shadow')) safeColor = fallbackShadow;
  
            try {
              el.style.setProperty(prop, safeColor);
            } catch (err) {
              console.warn(`Cannot override ${prop} on ${pseudo}`, el);
            }
          }
        }
      });
    });
  
    // Sanitize CSS variables from :root and body
    [document.documentElement, document.body].forEach(scope => {
      const styles = getComputedStyle(scope);
      for (const prop of styles) {
        const value = styles.getPropertyValue(prop);
        if (value.includes('lab(') && prop.startsWith('--')) {
          scope.style.setProperty(prop, fallbackBackground);
        }
      }
    });
  
    console.info('✅ LAB colors sanitized with safe fallbacks');
  }

export function getStatsInsightsColor(label: string | undefined){
  let color: string = 'text-primary';

  if(!label) return color;
  
  if(label.includes("Applies")){
    color = 'text-blue-700';
  }

  if(label.includes("Rejections")){
    color = 'text-red-500'
  }

  if(label.includes("Interviews")){
    color = 'text-green-500'
  }

  return color;
}