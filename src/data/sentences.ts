export interface Sentence {
  id: string;
  text: string;
  category: 'short' | 'medium' | 'long';
  title: string;
  language: 'mn' | 'en';
}

export const SENTENCES: Sentence[] = [
  // --- MONGOLIAN SENTENCES ---
  {
    id: '1',
    title: 'Боломж',
    text: 'Өглөө бүр шинэ боломжийг авчирдаг бөгөөд бид түүнийг хэрхэн ашиглахаас бидний амжилт шалтгаална.',
    category: 'short',
    language: 'mn'
  },
  {
    id: '2',
    title: 'Хүйтэн Нийслэл',
    text: 'Монгол улсын нийслэл Улаанбаатар хот нь дэлхийн хамгийн хүйтэн нийслэл хотод тооцогддог.',
    category: 'short',
    language: 'mn'
  },
  {
    id: '3',
    title: 'Авьяас чадвар',
    text: 'Хүн бүрт өөрийн гэсэн авьяас чадвар бий, гол нь түүнийгээ нээн илрүүлж, тууштай хөгжүүлэх явдал юм.',
    category: 'medium',
    language: 'mn'
  },
  {
    id: '4',
    title: 'Эрдэм ном',
    text: 'Эрдэм ном бол ертөнцийг харах цонх бөгөөд оюун ухааныг гэрэлтүүлэгч агуу хүч мөн билээ.',
    category: 'medium',
    language: 'mn'
  },
  {
    id: '5',
    title: 'Уралдааны дүрэм',
    text: 'Хурдан уралдахын тулд зөвхөн хурдан гүйх биш, харин алхам бүрээ зөв тооцоолох хэрэгтэй.',
    category: 'medium',
    language: 'mn'
  },
  {
    id: '6',
    title: 'Алдаанаас суралцах',
    text: 'Алдаа гэдэг бол амжилтанд хүрэх замын нэгэн хэсэг бөгөөд бидэнд шинэ сургамж, туршлага өгдөг.',
    category: 'medium',
    language: 'mn'
  },
  {
    id: '7',
    title: 'Монгол Наадам',
    text: 'Монголчууд эрт дээр үеэс хүлэг морио дээдлэн, хурдан морины уралдааныг наадам бүрийн гол чимэг болгосоор ирсэн.',
    category: 'long',
    language: 'mn'
  },
  {
    id: '8',
    title: 'Амьдралын зам',
    text: 'Амьдрал бол бартаатай уралдааны зам бөгөөд тууштай, тэвчээртэй байж л барианы шугаманд хүрнэ.',
    category: 'medium',
    language: 'mn'
  },
  {
    id: '9',
    title: 'Цаг хугацаа',
    text: 'Өнөөдөр хийж чадах зүйлээ маргааш гэж бүү хойшлуул, учир нь цаг хугацаа хэнийг ч хүлээдэггүй.',
    category: 'short',
    language: 'mn'
  },
  {
    id: '10',
    title: 'Эх орон',
    text: 'Эх орныхоо үзэсгэлэнт байгаль, цэнхэр тэнгэр, уудам тал нутгаар бахархах сэтгэл монгол хүн бүрийн зүрхэнд оршдог.',
    category: 'long',
    language: 'mn'
  },
  {
    id: '11',
    title: 'Цахим Ертөнц',
    text: 'Орчин үеийн технологийн хурдацтай хөгжил нь хүмүүсийн харилцаа холбоог хялбарчилж, мэдээллийг хэдхэн секундэд солилцох боломжийг бүрдүүлсэн.',
    category: 'long',
    language: 'mn'
  },
  {
    id: '12',
    title: 'Зорилго ба Хөдөлмөр',
    text: 'Зорилгодоо хүрэх хамгийн дөт зам бол өдөр бүр бага багаар ч хамаагүй урагш алхах, хэзээ ч бууж өгөхгүй байх тэвчээр юм.',
    category: 'medium',
    language: 'mn'
  },
  {
    id: '13',
    title: 'Эрүүл Мэнд',
    text: 'Эрүүл биед саруул ухаан оршино гэдэг шиг бие махбодоо чийрэгжүүлж, зөв хооллож, идэвхтэй хөдөлгөөнтэй байх нь аз жаргалын үндэс билээ.',
    category: 'long',
    language: 'mn'
  },
  {
    id: '14',
    title: 'Монголын Нууц Товчоо',
    text: 'Монголын Нууц Товчоо бол монгол түмний түүх, соёл, зан заншил, төрт ёсны уламжлалыг хадгалсан хосгүй үнэт бичгийн дурсгал мөн.',
    category: 'long',
    language: 'mn'
  },
  {
    id: '15',
    title: 'Байгаль дэлхий',
    text: 'Байгаль дэлхийгээ хайрлан хамгаалах нь хүн бүрийн ариун үүрэг бөгөөд цэвэр агаар, ундны ус бол амьдралын хамгийн үнэт баялаг юм.',
    category: 'medium',
    language: 'mn'
  },

  // --- ENGLISH SENTENCES ---
  {
    id: 'e1',
    title: 'Fresh Start',
    text: 'Every morning brings a new opportunity, and our success depends on how well we choose to use it.',
    category: 'short',
    language: 'en'
  },
  {
    id: 'e2',
    title: 'Speed of Light',
    text: 'Light travels at an incredible speed of nearly three hundred thousand kilometers per second.',
    category: 'short',
    language: 'en'
  },
  {
    id: 'e3',
    title: 'Learning & Growth',
    text: 'Making mistakes is a natural part of the learning process, offering us invaluable lessons and experience.',
    category: 'medium',
    language: 'en'
  },
  {
    id: 'e4',
    title: 'The Great Outdoors',
    text: 'Protecting our planet is a shared responsibility, as clean air and pure water are the foundation of all life.',
    category: 'medium',
    language: 'en'
  },
  {
    id: 'e5',
    title: 'Consistent Effort',
    text: 'The best way to achieve any long-term goal is to make consistent progress every single day, no matter how small.',
    category: 'medium',
    language: 'en'
  },
  {
    id: 'e6',
    title: 'Knowledge is Power',
    text: 'Education is a powerful window to the world, illuminating minds and empowering generations to build a brighter future.',
    category: 'medium',
    language: 'en'
  },
  {
    id: 'e7',
    title: 'Healthy Mind and Body',
    text: 'To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.',
    category: 'medium',
    language: 'en'
  },
  {
    id: 'e8',
    title: 'Art of Typing',
    text: 'To type fast and accurately requires not only quick finger movements, but also a focused mind and high concentration.',
    category: 'medium',
    language: 'en'
  },
  {
    id: 'e9',
    title: 'Never Give Up',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts in the long run.',
    category: 'medium',
    language: 'en'
  },
  {
    id: 'e10',
    title: 'The Age of Technology',
    text: 'The rapid evolution of modern technology has completely reshaped human communication, allowing us to share information in milliseconds across the entire globe.',
    category: 'long',
    language: 'en'
  },
  {
    id: 'e11',
    title: 'A Beautiful Journey',
    text: 'Life is like a complex race track filled with sharp curves and unexpected challenges, but with resilience, we will reach the finish line.',
    category: 'long',
    language: 'en'
  },
  {
    id: 'e12',
    title: 'The Power of Reading',
    text: 'A reader lives a thousand lives before he dies, while the man who never reads lives only one. Books open the magical doorways of imagination.',
    category: 'long',
    language: 'en'
  }
];
