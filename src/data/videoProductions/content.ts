


const videoProductionContent = {
  // Background Video
  backgroundVideo: "/videos/tryy.mp4",
  
  // Carousel Content
  carousel: {
    slides: [
      {
        topLeft: "Video Production Showcase",
        centerSubtitle: "Bringing stories to life through digital media",
        centerTitle: "Creative Vision",
        bottomLeft: "Digital Storytelling",
        bottomRight: "295+ Subscribers"
      },
      {
        topLeft: "Content Creation Journey",
        centerSubtitle: "From concept to screen - every frame tells a story",
        centerTitle: "Mizumi Kaito",
        bottomLeft: "YouTube Creator",
        bottomRight: "Growing Community"
      }
    ],
    navigation: {
      prev: "prev",
      next: "next"
    }
  },
  
  // Timeline Content
  timeline: {
    dragText: "Drag"
  }
};

// Export with proper destructuring
export { videoProductionContent };

// Destructured exports for easy access
export const {
  backgroundVideo,
  carousel,
  timeline
} = videoProductionContent;