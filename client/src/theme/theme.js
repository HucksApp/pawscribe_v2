import { Pagination, Tooltip } from "antd";
import { color } from "framer-motion";



export const customTheme = {
  token: {
    //global default style
    colorPrimary: 'var(--primary-color)',
    colorBgBase: 'var(--background-default)', //  CSS variable
    colorTextBase: 'var(--text-primary)',
    colorBorder: 'var(--divider-color)', // Border color
    colorBgMask:"var(--modal-overlay-color)",
  },
  components: {
    //components style
    Button: {
      defaultHoverBorderColor:'var(--button-primary-bg-color)',
      defaultColor: 'var(--button-text-color)',
      defaultBg:'var(--button-primary-bg-color )',
      defaultHoverColor: 'var(--button-primary-hvtext)',
      defaultHoverBg:'var(--button-primary-hvbg-color',
      /* colorPrimary: 'var(--button-text-color)',
      colorPrimaryHover: 'var(--button-hover-bg-color)', */
      
    },
    Switch:{
      handleBg:'var(--button-secondary-bg-color)',
    },
    Card: {
      boxShadow: '0px 4px 8px var(--divider-color)',
      borderColor: 'var(--divider-color)', //  adding border customization
    },
    Input: {
      colorBgContainer: 'var(--form-bg-color)',
      colorBorder: 'var(--divider-color)',
    },
  
    Modal:{
      contentBg:'var(--background-paper)',
      titleColor:'var(--text-primary)',
      titleFontSize:'2em'
    },
    Pagination:{
      itemActiveBg:'var(--button-primary-bg-color)',
      itemBg:"var(--background-default)",
      colorText:"var(--text-primary)"
    }
    

  },
};



/**
 * Animation variants for page transitions within the application.
 *
 * This object defines the initial, animate, and exit states for page
 * animations to create smooth transitions between different views.
 *
 * @constant {Object} pageVariants
 * @returns {Object} The animation variants for page transitions.
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,  // Start at 90% of the original size
  },
  animate: {
    opacity: 1,
    scale: 1,   // Scale to full size (100%)
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,  // Shrink back to 90% of the original size
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};


/**
 * Transition configuration for page animations.
 *
 * This object defines the type, ease, and duration of transitions for
 * the page animations, providing a cohesive visual experience.
 *
 * @constant {Object} pageTransition
 * @returns {Object} The transition configuration for page animations.
 */

export const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};