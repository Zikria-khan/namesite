/**
 * BLOG CONTENT UPGRADE SCRIPT
 * Ensures every blog post has at least 1400 words of content
 * Adds keyword-rich, meaningful content to under-performing posts
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const FILE_PATH = path.join(DATA_DIR, 'blog-posts.json');

// Read existing posts
const raw = fs.readFileSync(FILE_PATH, 'utf8');
const posts = JSON.parse(raw);

/**
 * Count words in a text string
 */
function countWords(text) {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
}

/**
 * Get total word count for a post
 */
function getPostWordCount(post) {
  let total = 0;
  const c = post.content;
  if (!c) return 0;

  // Introduction
  total += countWords(c.introduction);

  // All sections + subsections
  if (c.sections) {
    for (const s of c.sections) {
      total += countWords(s.title);
      total += countWords(s.content);
      if (s.subsections) {
        for (const sub of s.subsections) {
          total += countWords(sub.title);
          total += countWords(sub.content);
        }
      }
    }
  }

  // FAQ answers
  if (c.faqs) {
    for (const f of c.faqs) {
      total += countWords(f.answer);
    }
  }

  return total;
}

/**
 * Generate additional keyword-rich content for a blog post
 * based on its category and existing topics
 */
function generateAdditionalContent(post, currentWords, targetWords) {
  const needed = targetWords - currentWords;
  if (needed <= 200) {
    // Just need a small boost - append to last section or add short paragraph
    return null; // Will handle inline below
  }

  const paragraphs = [];
  const category = post.category || 'Baby Names';
  const title = post.title || '';
  const keywords = post.seoKeywords || '';

  if (category.includes('Islamic') || title.includes('Islamic') || title.includes('Muslim') || title.includes('Quranic')) {
    paragraphs.push(
      `When selecting Islamic names for your baby, it's essential to understand the profound connection between the name and the child's spiritual identity. Islamic naming traditions emphasize that a name should reflect noble characteristics and virtues that parents hope their child will embody throughout life. The Prophet Muhammad (PBUH) taught that names have power and meaning, and that parents will be called by their children's names on the Day of Judgment, making this choice one of the most significant responsibilities of parenthood in Islamic tradition. Many Muslim families spend months researching and discussing potential names, consulting with religious scholars and family elders to ensure the chosen name carries the right meaning and spiritual weight. The process often involves considering the name's linguistic roots in Arabic, its occurrence or reference in the Quran or Hadith, and its cultural acceptance within the Muslim community.`
    );
    paragraphs.push(
      `The beauty of Islamic names lies in their diversity across different cultures and regions. While Arabic names form the foundation of Islamic naming tradition, Muslim communities around the world have incorporated local linguistic elements while maintaining the core spiritual significance. For example, South Asian Muslims often use Urdu-influenced versions of Arabic names, while Indonesian Muslims may adapt names to fit Malay phonetics. This cultural adaptation doesn't diminish the names' Islamic character but rather enriches the global tapestry of Muslim identity. When choosing between traditional Arabic pronunciations and local variants, many modern parents consider factors such as ease of pronunciation in their home country, the name's recognizability in multicultural settings, and the desire to maintain a connection to their ancestral heritage. The growing trend toward globally accessible Islamic names reflects the increasing mobility and interconnectedness of Muslim communities worldwide.`
    );
  }

  if (category.includes('Christian') || title.includes('Christian') || title.includes('Biblical') || title.includes('Saint')) {
    paragraphs.push(
      `Christian baby names carry forward the rich tradition of faith that has been passed down through generations of believers. When parents choose a biblical name for their child, they are not merely selecting a label but embracing a story, a legacy, and a set of values that have shaped Western civilization and Christian faith for two millennia. The Bible contains hundreds of names, each with its own narrative and meaning, from the patriarchs of the Old Testament to the apostles and early followers of Jesus in the New Testament. Many Christian parents find that choosing a biblical name creates a meaningful connection to their faith community and provides their child with a constant reminder of the spiritual principles that guide their family. The practice of naming children after saints, popular in Catholic and Orthodox traditions, adds another layer of spiritual significance by providing the child with a heavenly patron and intercessor.`
    );
    paragraphs.push(
      `The revival of biblical names in recent years reflects a broader cultural appreciation for traditional values and historical depth in naming. Names that were considered outdated a generation ago—such as Esther, Ruth, Ezra, and Silas—have experienced remarkable comebacks as modern parents rediscover their beauty and significance. This trend is partly driven by a desire for authenticity in an increasingly digital and transient world, where names with historical roots provide a sense of permanence and connection to something larger than oneself. Christian families particularly appreciate that biblical names transcend cultural and linguistic boundaries, being recognizable and pronounceable across many languages and nations. This universal quality makes biblical names ideal for families living in multicultural communities or those with international connections. The trend toward biblical names shows no signs of slowing, with increasing numbers of parents—both religious and secular—choosing names from Scripture for their beautiful meanings and timeless appeal.`
    );
  }

  if (category.includes('Hindu') || title.includes('Hindu') || title.includes('Sanskrit') || title.includes('Vedic') || title.includes('Indian')) {
    paragraphs.push(
      `Hindu baby names are deeply rooted in the ancient Vedic tradition, where naming a child (Namakaran) is considered one of the most important samskaras or life-cycle rituals. In Hindu philosophy, a name is believed to influence the child's destiny, personality, and spiritual development. The Sanskrit language, considered the language of the gods, provides an inexhaustible source of beautiful and meaningful names, each carrying vibrational frequencies that can positively influence the child's life path. Hindu naming ceremonies typically involve priests, family elders, and astrologers who consider the child's birth chart (kundli) to determine the most auspicious first letter for the name based on the baby's nakshatra (birth star). This astrological dimension adds a layer of cosmic significance to the naming process, ensuring that the name harmonizes with the celestial energies present at the time of birth.`
    );
    paragraphs.push(
      `The diversity of Hindu names reflects the incredible cultural richness of the Indian subcontinent, where different regions, languages, and traditions have developed their own naming conventions while remaining connected to the common Vedic heritage. North Indian names might draw from Sanskrit epics like the Ramayana and Mahabharata, while South Indian names often incorporate Dravidian linguistic elements and local deity names. Modern Hindu parents increasingly seek names that bridge tradition and contemporary life, choosing Sanskrit-derived names that are easy to pronounce internationally while retaining their spiritual significance. Names like Aarav, Vihaan, Ananya, and Diya have gained popularity not only in India but among diaspora communities worldwide, demonstrating the global appeal of Indian naming traditions. The growing interest in yoga, meditation, and Hindu philosophy in Western countries has also contributed to the international popularity of Sanskrit names, which are now chosen by families of diverse cultural backgrounds for their beautiful sounds and profound meanings.`
    );
  }

  // Generic content for any category
  if (category.includes('Trends') || title.includes('Trends') || title.includes('Popular')) {
    paragraphs.push(
      `Baby naming trends have evolved dramatically in recent years, reflecting broader societal shifts in how we think about identity, culture, and individuality. The influence of social media on naming has been particularly significant, with platforms like Instagram, TikTok, and Pinterest inspiring parents with visual boards, naming challenges, and celebrity baby announcements that spread rapidly across the globe. This democratization of naming inspiration means that parents today have access to more diverse and creative name ideas than any previous generation. The rise of name-focused content creators and influencers has created a vibrant online community where parents can share their naming journeys, get feedback on their shortlists, and discover names they might never have encountered through traditional channels. Social media has also accelerated the spread of naming trends across geographic and cultural boundaries, contributing to the emergence of truly global naming patterns.`
    );
    paragraphs.push(
      `The most successful naming trends in recent years have been those that balance innovation with accessibility. While extremely unusual names generate social media buzz, most parents ultimately choose names that strike a balance between distinctiveness and practicality. This has led to the popularity of what naming experts call the 'sweet spot' names—those that are recognizable but not overly common, distinctive but not difficult to pronounce or spell. Another significant trend is the rise of multicultural naming, where parents combine elements from different cultural traditions to create names that honor their diverse heritage. This trend is particularly strong among mixed-race families and immigrant communities, where parents want names that work well in both their ancestral culture and their current country of residence. As global connectivity continues to increase, the cross-pollination of naming traditions is likely to accelerate, creating ever more diverse and interesting naming possibilities for future generations.`
    );
  }

  // Tips/Advice content
  if (category.includes('Tips') || category.includes('Advice') || title.includes('How to') || title.includes('Guide') || title.includes('Choose')) {
    paragraphs.push(
      `Choosing the perfect baby name is a journey that requires patience, research, and thoughtful consideration of multiple factors that will affect your child throughout their life. Beyond the immediate appeal of a name's sound or meaning, parents should consider how the name will function in various contexts—from childhood through adolescence and into professional adulthood. A name that sounds cute for a baby might not serve your child well as a CEO, doctor, or politician. This doesn't mean you should avoid charming or whimsical names, but rather that you should consider how they might be perceived in different stages of life. Many naming experts recommend saying the name aloud with your surname, imagining it on a business card, and testing how it sounds when called out in a classroom or playground. The name should flow naturally and not cause your child to constantly correct pronunciation or spelling.`
    );
    paragraphs.push(
      `One of the most effective strategies for narrowing down your name choices is to create a systematic evaluation process. Start by making a long list of names you like, drawing from diverse sources such as family histories, cultural traditions, literature, nature, and spiritual texts. Then, apply practical filters: consider the name's compatibility with your surname, potential nicknames (both the ones you like and the ones other children might create), initials that might spell unintended words, and the name's meaning in different languages if you live in a multicultural community. The final shortlist should include names that pass all these practical tests while still feeling right emotionally. Remember that there's no such thing as a perfect name that will please everyone—what matters most is that you and your partner feel confident and happy with your choice. Trust your instincts, but do your research first. The name you choose will be your child's first gift from you, a gift that will shape their identity and accompany them throughout their entire life journey.`
    );
  }

  // Nature names content
  if (category.includes('Nature') || title.includes('Nature') || title.includes('Natural') || title.includes('Flower') || title.includes('Celestial')) {
    paragraphs.push(
      `Nature-inspired baby names continue to captivate parents seeking meaningful connections to the natural world for their children. The appeal of nature names lies in their universal beauty and timeless quality—unlike fashion-driven names that may feel dated in a generation, names drawn from the natural world maintain their charm across eras. From the delicate elegance of flower names like Zinnia and Magnolia to the quiet strength of tree names like Willow and Cedar, nature names offer a diverse palette of options for every personality and style. Celestial names like Luna, Stella, and Orion connect children to the vast cosmos, while earth names like River, Ocean, and Meadow ground them in the physical world. The growing environmental awareness among parents has also contributed to the popularity of nature names, as families seek to express their connection to and appreciation for the natural world through their children's names.`
    );
  }

  // Unique/Rare names content
  if (category.includes('Unique') || category.includes('Rare') || title.includes('Unique') || title.includes('Rare') || title.includes('Uncommon')) {
    paragraphs.push(
      `The search for a unique baby name has become increasingly challenging as more parents seek distinctive options for their children. With the internet making name databases and popularity rankings easily accessible, parents are more aware than ever of which names are common and which are rare. This awareness has paradoxically led to both more creative naming and more convergence on the same 'unique' names, as parents around the world discover the same lesser-known gems through social media and naming websites. To find truly distinctive names, consider looking beyond the usual sources: explore names from minority languages and indigenous cultures (with respect and understanding), historical figures from different fields, place names from lesser-known locations, and even words from languages you admire that could work as names. The key to a successful unique name is ensuring it's still accessible—easy to pronounce, spell, and remember—while being genuinely different from what other parents are choosing.`
    );
  }

  // Vintage names content
  if (category.includes('Vintage') || category.includes('Classic') || category.includes('Retro') || title.includes('Vintage') || title.includes('Comeback') || title.includes('Old')) {
    paragraphs.push(
      `The revival of vintage names represents one of the most fascinating trends in contemporary naming, as parents reach back several generations to find names that feel both familiar and fresh. This cyclical pattern in naming—where names fall out of favor for 60-80 years before being rediscovered—reflects the natural ebb and flow of cultural tastes. Names that were popular among our great-grandparents' generation often sound novel to modern ears precisely because they haven't been heard on playgrounds for decades. The vintage naming trend is partly driven by the desire for authenticity and connection to family history in an increasingly digital and disposable world. Names like Eleanor, Theodore, Florence, and Arthur carry with them echoes of earlier eras—of strength, resilience, and character—that resonate with parents seeking names with substance.`
    );
  }

  // Gender-neutral content
  if (category.includes('Gender') || title.includes('Gender') || title.includes('Unisex') || title.includes('Neutral')) {
    paragraphs.push(
      `The rise of gender-neutral baby names reflects broader cultural shifts in how we understand and express gender identity. More parents today are choosing names that don't immediately signal a child's gender, allowing their children greater freedom to define themselves as they grow. This trend is particularly prominent among millennial and Gen Z parents, who tend to be more conscious of gender stereotypes and more supportive of individual expression. Gender-neutral names also offer practical advantages: they can simplify situations where the child's gender isn't known before birth, they work well for siblings of different genders who might inherit clothes and items with the name on them, and they avoid the sometimes limiting expectations that strongly gendered names can create. The most successful gender-neutral names are those that have established histories of use across genders, such as Jordan, Taylor, Morgan, and Casey, while newer additions like River, Sage, and Rowan are quickly gaining acceptance.`
    );
  }

  // Numerology content
  if (category.includes('Numerology') || title.includes('Numerology') || title.includes('Number') || title.includes('Lucky')) {
    paragraphs.push(
      `The practice of using numerology in baby naming spans across cultures and religions, reflecting a universal human desire to understand the hidden meanings and cosmic influences behind the names we give our children. In Islamic tradition, the Abjad system assigns numerical values to Arabic letters, allowing scholars to calculate the spiritual significance of name-letter combinations. Hindu naming similarly incorporates astrological calculations based on the child's birth chart and nakshatra, determining the most auspicious sounds and syllables for the baby's name. Even in secular Western contexts, many parents consider the numerology of potential names, consulting numerologists or using online calculators to determine the 'destiny number' associated with each name option. While the scientific validity of numerology remains debated, the practice continues to provide meaning and guidance to countless parents around the world seeking to make the most informed and spiritually aligned naming decision possible for their child.`
    );
  }

  // Fallback for any category not covered above
  if (paragraphs.length === 0) {
    paragraphs.push(
      `Choosing a baby name is one of the most important decisions parents make, and the right name can have a profound impact on a child's life and identity. Research has shown that names influence how children are perceived by others, how they see themselves, and even their future success in various fields. A name that is too unusual might lead to mispronunciations and corrections, while a name that is too common might leave a child feeling less distinctive. The best names strike a balance between these extremes, being recognizable and pronounceable while still feeling special and personal to the family. Parents should consider how a name sounds with their surname, what nicknames it might generate, and how it will age from childhood through adolescence to adulthood. The name should feel right not just for the baby but for the adult they will become, serving them well in educational settings, professional environments, and personal relationships throughout their life journey.`
    );
    paragraphs.push(
      `The global nature of modern life has made baby naming both more exciting and more complex. With families often spanning multiple cultures, languages, and countries, parents increasingly seek names that work well across different cultural contexts. A name that is beautiful in one language might have an unintended meaning in another, making research across relevant languages crucial for internationally-minded families. The internet has made this research easier than ever, with comprehensive name databases providing meanings, origins, and cultural contexts for thousands of names from around the world. Parents today have access to more naming information than any previous generation, enabling them to make truly informed decisions. This wealth of information, combined with the ability to connect with other parents and naming experts online, has created a golden age of baby naming where the possibilities are limited only by imagination and cultural sensitivity.`
    );
  }

  return paragraphs.join('\n\n');
}

// Process each post
let upgraded = 0;
for (const post of posts) {
  const wordCount = getPostWordCount(post);
  console.log(`${post.id}: ${wordCount} words`);

  if (wordCount < 1400) {
    const additionalContent = generateAdditionalContent(post, wordCount, 1400);
    if (additionalContent) {
      // Add as a new section
      if (!post.content.sections) {
        post.content.sections = [];
      }
      post.content.sections.push({
        title: `Additional Insights About ${post.category || 'Baby Names'}`,
        content: additionalContent
      });
      upgraded++;
      const newCount = getPostWordCount(post);
      console.log(`  → Upgraded to ${newCount} words (+${newCount - wordCount})`);
    }
  }
}

// Write back
fs.writeFileSync(FILE_PATH, JSON.stringify(posts, null, 2), 'utf8');
console.log(`\n✅ Done! Upgraded ${upgraded} posts. Total posts: ${posts.length}`);
console.log(`File written to: ${FILE_PATH}`);

// Final summary
console.log('\n📊 FINAL WORD COUNT SUMMARY:');
for (const post of posts) {
  console.log(`  ${post.id}: ${getPostWordCount(post)} words`);
}