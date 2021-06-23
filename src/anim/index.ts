const exitTransition = {
  duration: 0.3,
  ease: [0.43, 0.13, 0.23, 0.96],
};

export const mainPageAnimation = {
  exit: { y: "50%", opacity: 0, transition: exitTransition },
  enter: {
    y: "0%",
    opacity: 1,
    transition: exitTransition,
  },
};

export const homeAnimation = {
  exit: { y: "50%", opacity: 0, transition: exitTransition },
  enter: {
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0,
      when: "beforeChildren",
      staggerChildren: 0.25,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

export const searchAnimation = {
  exit: { y: "50%", opacity: 0, transition: exitTransition },
  enter: {
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.04,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

export const categoryAnimation = {
  exit: { y: "0%", opacity: 0, transition: exitTransition },
  enter: {
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.04,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

export const filePageAnimation = {
  exit: { x: "50%", opacity: 0, transition: exitTransition },
  enter: {
    x: "0%",
    opacity: 1,
    transition: exitTransition,
  },
};

export const sidebarItemAnimation = {
  out: {
    transition: exitTransition,
  },
  in: {
    transition: {
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.04,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

export const sidebarItemAnim = {
  out: { x: "-50%" },
  in: { x: "0" },
};

export const cellEntryAnim = {
  exit: { y: 20, opacity: 0 },
  enter: {
    y: 0,
    opacity: 1,
  },
};

export const catAnimation = {
  exit: { y: "50%", opacity: 0 },
  enter: {
    y: 0,
    opacity: 1,
  },
};
