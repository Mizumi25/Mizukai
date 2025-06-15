const portraitdata = {
    // Main Section Title
    sectionTitle: "ArtWorks",
    
    // Portrait Gallery Content
    galleryTitle: "Portrait Collection",
    gallerySubtitle: "Digital Expressions of Human Emotion",
    
    // Artist Statement
    artistStatement: {
        title: "Artist's Vision",
        content: "Through digital portraiture, I explore the delicate balance between realism and stylization. Each piece represents not just a face, but a story - capturing the essence of emotion, personality, and the unique spark that makes each subject truly alive. My work bridges traditional portrait techniques with modern digital artistry."
    },
    
    // Technique Description
    techniqueDescription: {
        title: "Digital Craftsmanship",
        content: "Using advanced digital tools and mobile art applications, I create portraits that blend photorealistic detail with artistic interpretation. My process involves careful study of light, shadow, and facial structure, combined with a deep understanding of color theory and digital painting techniques to bring each subject to life."
    },
    
    // Portfolio Descriptions for each artwork
    artworks: [
        {
            id: 1,
            title: "Soul Reflection",
            description: "A contemplative portrait exploring the depth of human introspection. This piece captures the quiet moments when we truly see ourselves.",
            technique: "Digital painting with soft brush techniques",
            year: "2024"
        },
        {
            id: 2,
            title: "Urban Dreams",
            description: "A modern portrait showcasing the ambition and hope of youth in today's digital age. The subject's gaze speaks of future possibilities.",
            technique: "Mixed digital media with photographic elements",
            year: "2024"
        },
        {
            id: 3,
            title: "Cultural Heritage",
            description: "Celebrating Filipino identity through portraiture. This work honors the rich cultural tapestry and proud heritage of my homeland.",
            technique: "Traditional digital painting with cultural motifs",
            year: "2023"
        },
        {
            id: 4,
            title: "Gentle Strength",
            description: "A portrait that embodies quiet confidence and inner peace. The subject radiates the kind of strength that comes from self-acceptance.",
            technique: "Soft realism with atmospheric lighting",
            year: "2024"
        }
    ],
    
    // Process Insights
    processInsights: [
        {
            step: "Observation",
            description: "Every portrait begins with careful observation of the subject's unique features, expressions, and the story their face tells."
        },
        {
            step: "Digital Sketching",
            description: "Using mobile digital tools, I create initial sketches focusing on proportions and capturing the essential character of the subject."
        },
        {
            step: "Color Harmony",
            description: "I develop a color palette that not only represents accurate skin tones but also conveys the emotional atmosphere of the piece."
        },
        {
            step: "Detail Refinement",
            description: "The final stage involves refining details, adjusting lighting, and ensuring every element contributes to the overall narrative."
        }
    ],
    
    // Personal Touch Descriptions
    personalTouch: {
        title: "The Mizumi Kaito Style",
        content: "My portraits are characterized by their gentle realism and emotional depth. I believe that true portraiture goes beyond physical likeness - it captures the soul of the subject. Each piece reflects my philosophy of bridging technical skill with heartfelt artistic expression."
    },
    
    // Commission Information
    commissionInfo: {
        title: "Custom Portrait Commissions",
        description: "I offer personalized digital portrait services, creating unique artworks that celebrate the individual beauty and character of each subject. Whether it's a personal portrait, family piece, or professional headshot, I work closely with clients to bring their vision to life.",
        process: "My commission process involves initial consultation, sketch approval, and collaborative refinement to ensure the final artwork exceeds expectations."
    },
    
    // Future Vision
    futureVision: {
        title: "Evolving Artistry",
        content: "As I continue to grow as both an artist and developer, I'm exploring new ways to integrate technology into my artistic practice. From AI-assisted techniques to interactive digital portraits, I'm always pushing the boundaries of what digital art can achieve while maintaining the human touch that makes each piece special."
    },
    
    // Japanese Elements
    japaneseTitles: {
        portraits: "肖像画", // Shōzō-ga - Portraits
        art: "芸術", // Geijutsu - Art
        beauty: "美", // Bi - Beauty
        soul: "魂", // Tamashii - Soul
        expression: "表現", // Hyōgen - Expression
        creation: "創造" // Sōzō - Creation
    },
    
    // Meta Information
    pageDescription: "Explore the digital portrait collection of Mizumi Kaito (James Rafty D Libago), featuring contemporary digital art that captures human emotion and character through skilled digital painting techniques.",
    
    // Social Sharing
    shareText: "Discover the artistic vision of Mizumi Kaito through this collection of digital portraits that blend technical mastery with emotional storytelling."
};

// Export with proper destructuring
export { portraitdata };

// Destructured exports for easy access
export const {
    sectionTitle,
    galleryTitle,
    gallerySubtitle,
    artistStatement,
    techniqueDescription,
    artworks,
    processInsights,
    personalTouch,
    commissionInfo,
    futureVision,
    japaneseTitles,
    pageDescription,
    shareText
} = portraitdata;