import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';


// npm install scrollreveal
// hover:-translate-y-16 transition ease-in-out duration-500

const ExampleComponent = () => {
  useEffect(() => {
    // Apply ScrollReveal to the desired elements
    ScrollReveal().reveal('.reveal1', {
      duration: 1000,
      distance: '100px',
      easing: 'ease-in-out',
      origin: 'top',
      reset: true, // This allows the animation to trigger every time the component is visible
    });
  }, [] );
  
  useEffect(() => {
    ScrollReveal().reveal('.reveal4', {
      duration: 1000,
      distance: '100px',
      easing: 'ease-in-out',
      origin: 'bottom',
      reset: true, 
    });
  }, [] );
  
   useEffect(() => {
    ScrollReveal().reveal('.reveal2', {
      duration: 1200,
      distance: '70px',
      easing: 'ease-in-out',
      origin: 'left',
      reset: true,
    });
   }, [] );
  
   useEffect(() => {
    ScrollReveal().reveal('.reveal3', {
      duration: 1200,
      distance: '70px',
      easing: 'ease-in-out',
      origin: 'right',
      reset: true, 
    });
  }, []);

  return (
    <div>
    </div>
  );
};

export default ExampleComponent;
