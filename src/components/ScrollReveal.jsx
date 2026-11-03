import { motion, useReducedMotion } from "framer-motion";

function ScrollReveal({ children, delay = 0, className = "" }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.7,
                delay: shouldReduceMotion ? 0 : delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}

export default ScrollReveal;