import { motion } from 'framer-motion';

interface SkillTagProps {
  name: string;
  icon?: React.ReactNode;
}

export default function SkillTag({ name, icon }: SkillTagProps) {
  return (
    <motion.span
      className="skill-tag cursor-default"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {icon && <span style={{ color: '#A78BFA' }}>{icon}</span>}
      {name}
    </motion.span>
  );
}
