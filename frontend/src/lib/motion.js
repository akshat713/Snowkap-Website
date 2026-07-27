export const EASE = [0.76, 0, 0.24, 1];
export const EASE_OUT = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT, delay: i * 0.08 },
  }),
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

export const maskLine = {
  hidden: { y: "115%" },
  show: (i = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: EASE, delay: 0.15 + i * 0.09 },
  }),
};

export const viewport = { once: true, amount: 0.25 };
