import { motion } from 'framer-motion';

export const NebulaClouds = ({ isDark }) => {
  const darkClouds = [
    { color: 'rgba(88, 28, 135, 0.3)', top: '5%', left: '5%' },
    { color: 'rgba(30, 58, 138, 0.25)', top: '10%', right: '5%' },
    { color: 'rgba(67, 56, 202, 0.2)', bottom: '10%', left: '10%' },
    { color: 'rgba(49, 46, 129, 0.22)', bottom: '5%', right: '8%' }
  ];

  const lightClouds = [
    { color: 'rgba(196, 181, 253, 0.3)', top: '5%', left: '5%' },
    { color: 'rgba(165, 180, 252, 0.25)', top: '10%', right: '5%' },
    { color: 'rgba(221, 214, 254, 0.3)', bottom: '10%', left: '10%' },
    { color: 'rgba(191, 219, 254, 0.25)', bottom: '5%', right: '8%' }
  ];

  const clouds = isDark ? darkClouds : lightClouds;
  const animations = ['nebulaDrift1', 'nebulaDrift2', 'nebulaDrift3', 'nebulaDrift4'];
  const durations = [14, 18, 16, 20];

  return (
    <>
      <style>{`
        @keyframes nebulaDrift1 {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(25px, 18px) scale(1.06); }
        }
        @keyframes nebulaDrift2 {
          0% { transform: translate(0px, 0px) scale(1.03); }
          100% { transform: translate(-22px, 12px) scale(0.96); }
        }
        @keyframes nebulaDrift3 {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(18px, -14px) scale(1.05); }
        }
        @keyframes nebulaDrift4 {
          0% { transform: translate(0px, 0px) scale(1.02); }
          100% { transform: translate(-18px, -8px) scale(0.97); }
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {clouds.map((cloud, index) => (
          <motion.div
            key={`${isDark}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDark ? 0.65 : 0.35 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              width: '650px',
              height: '420px',
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${cloud.color} 0%, transparent 60%)`,
              filter: isDark ? 'blur(90px)' : 'blur(75px)',
              animation: `${animations[index]} ${durations[index]}s ease-in-out infinite alternate`,
              ...Object.fromEntries(
                Object.entries(cloud).filter(([key]) => ['top', 'bottom', 'left', 'right'].includes(key))
              )
            }}
          />
        ))}
      </div>
    </>
  );
};
