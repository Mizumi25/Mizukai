const storydata = {
    // Section 1 - Hero
    heroTitle: "Mizumi's Literary Universe",
    
    // Section 2 - Introduction
    introText1: "はじめまして、ミズミカイトと申します。本名はJames Rafty D Libagoで、デジタルアーティストとフルスタック開発者を目指している20歳の日本系フィリピン人です。",
    introText2: "私は技術と創造性を融合させることに情熱を注いでおり、コードと物語の両方を通じて人々の心に響く作品を作り出すことを目指しています。",
    introText3: "このセクションでは、私が創作した小説や物語を紹介します。それぞれの作品には、人間の感情、技術の進歩、そして現代社会における私たちの位置についての深い考察が込められています。",
    welcomeText1: "Welcome to my literary sanctuary, where technology meets storytelling and digital dreams come alive through words.",
    welcomeText2: "Here, I explore the intersection of human emotion and digital innovation, crafting narratives that bridge the gap between our analog hearts and digital souls.",
    welcomeText3: "Each story is a reflection of my journey as both a developer and an artist, weaving together themes of connection, growth, and the endless possibilities that emerge when creativity meets code.",
    
    // Section 4 - Most Read
    mostReadTitle: "Featured Stories",
    mostReadStories: [
        {
            id: 1,
            number: "01",
            title: "Digital Echoes",
            description: "A tale of a young programmer who discovers that every line of code he writes creates ripples in a parallel digital dimension, where his virtual creations come to life and begin to question their existence."
        },
        {
            id: 2,
            number: "02",
            title: "The Last Debugger",
            description: "In a world where AI has taken over most programming tasks, one human developer must fix a critical bug that threatens to crash the entire digital infrastructure that humanity depends on."
        },
        {
            id: 3,
            number: "03",
            title: "Canvas of Code",
            description: "A story about an artist-programmer who learns to paint with algorithms, creating digital masterpieces that blur the line between traditional art and computational creativity."
        },
        {
            id: 4,
            number: "04",
            title: "Connection Lost",
            description: "When a social media developer realizes that his app is isolating people rather than connecting them, he embarks on a journey to rediscover authentic human connection in the digital age."
        },
        {
            id: 5,
            number: "05",
            title: "The Memory Compiler",
            description: "A programmer develops an algorithm that can compress and store human memories as data, but when he tests it on himself, he begins to question what makes us truly human."
        }
    ],
    
    // Section 5 - Genres
    genresTitle: "Story Categories",
    
    // Section 6 - Compilation
    compilationTitle: "Story Collections",
    
    // Section 7 - Final Section
    finalSectionTitle: "The Writer's Journey",
    conceptText1: "Every line of code tells a story, and every story I write is built with the precision of programming logic combined with the artistry of human emotion.",
    conceptText2: "As both a developer and storyteller, I believe that the future of literature lies in the intersection of technology and creativity. My stories explore themes of digital consciousness, human connection in virtual spaces, and the evolving relationship between humanity and artificial intelligence.",
    conceptText3: "Through my writing, I aim to capture the essence of our digital age while never losing sight of the fundamental human experiences that connect us all. Each narrative is a bridge between the technical and the emotional, the logical and the intuitive."
};

// Export with proper destructuring
export { storydata };

// Destructured exports for easy access
export const {
    heroTitle,
    introText1,
    introText2,
    introText3,
    welcomeText1,
    welcomeText2,
    welcomeText3,
    mostReadTitle,
    mostReadStories,
    genresTitle,
    compilationTitle,
    finalSectionTitle,
    conceptText1,
    conceptText2,
    conceptText3
} = storydata;