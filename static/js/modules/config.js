'use strict';

export const config = {
    isEdgeMobile:   /Edg\/\d+/i.test(navigator.userAgent) && /Mobile/i.test(navigator.userAgent),
    isEdge:         /Edg\/\d+/i.test(navigator.userAgent),
    isMobile:       /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    isLowEndDevice: navigator.hardwareConcurrency <= 4 ||
                    (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2),
    isTouchDevice:  ('ontouchstart' in window) || navigator.maxTouchPoints > 0,
    prefersDarkScheme: false
};

export const appData = {
    services: [
        {
            id: 'SVC-001',
            title: 'ANIME STYLE ILLUSTRATION',
            descriptionId: 'Character design, visual storytelling, dan ilustrasi dengan style unik ILUZTAR.',
            descriptionEn: 'Character design, visual storytelling, and illustration with ILUZTAR\'s unique style.',
            category: 'ART',
            specialty: 'SPECIALTY',
            number: '01'
        },
        {
            id: 'SVC-002',
            title: 'GRAPHIC BRANDING',
            descriptionId: 'Logo design, brand identity, dan visual branding yang memorable dan profesional.',
            descriptionEn: 'Logo design, brand identity, and visual branding that is memorable and professional.',
            category: 'DESIGN',
            specialty: 'BRANDING',
            number: '02'
        },
        {
            id: 'SVC-003',
            title: 'PHOTO EDITING',
            descriptionId: 'Photo editing, compositing, dan creative manipulation untuk kebutuhan promosi dan konten.',
            descriptionEn: 'Photo editing, compositing, and creative manipulation for promotional and content needs.',
            category: 'PHOTO',
            specialty: 'EDITING',
            number: '03'
        },
        {
            id: 'SVC-004',
            title: 'CREATIVE SUPPORT',
            descriptionId: 'Sistem pendukung bagi artist yang membutuhkan bantuan, baik melalui kolaborasi maupun asistensi pada bagian spesifik.',
            descriptionEn: 'A support system for artists who need assistance, either through collaboration or by providing assistance in specific parts.',
            category: 'SUPPORT',
            specialty: 'COMMUNITY',
            number: '04'
        }
    ],

    testimonials: [
        {
            name: 'Artofz', role: 'Fulltime Illustrator', idname: 'artof_z99',
            socialLink: 'https://instagram.com/artof_z99', rating: 5,
            img: './img/zaid.webp',
            text: 'Respon cepat dan profesional. Kami telah berkolaborasi dalam lebih dari 15 project dengan 40+ karakter yang diwarnai oleh Iluztar.',
            type: 'collab'
        },
        {
            name: 'Haomon Koo', role: 'Freelance Illustrator', idname: 'haomon_koo',
            socialLink: 'https://www.facebook.com/HaoMonK2', rating: 5,
            img: './img/haomon.webp',
            text: 'Kemampuan Iluztar dalam mengerjakan Commission Photobash Background dan Desain Karakter sangatlah Professional. Illuztar mampu menyelesaikan tepat waktu dan sesuai ekspetasi aku.',
            type: 'client'
        },
        {
            name: 'Duca', role: 'Teacher', idname: 'educa_umm',
            socialLink: 'https://instagram.com/educa.umm', rating: 5,
            img: './img/duca.webp',
            text: 'Pelayanan Iluztar Studio memuaskan! Proses diskusi konsep hingga final logo @educa.umm berjalan lancar. Tim responsif, profesional, dan detail. Hasilnya mewakili identitas akun saya dengan baik.',
            type: 'client'
        },
        {
            name: 'Ariko', role: 'Childrenbook illustrator', idname: 'arikooo_',
            socialLink: 'https://instagram.com/arikooo_', rating: 5,
            img: './img/ariko.webp',
            text: 'Good service, recommended. 👍🏽👍🏽',
            type: 'collab'
        },
        {
            name: 'Sani', role: 'Illustrator', idname: 'sanivi__',
            socialLink: 'https://instagram.com/sanivi__', rating: 5,
            img: './img/sani.webp',
            text: 'Fast response, professional attitude, and outstanding illustration quality. The final result exceeded my expectations. Highly recommended.',
            type: 'collab'
        },
        {
            name: 'Idda', role: 'Student', idname: 'uswah_one17',
            socialLink: 'https://instagram.com/uswah_one17', rating: 5,
            img: './img/idda.webp',
            text: 'Desain bagus sesuai ide sampai detailingnya.',
            type: 'client'
        },
        {
            name: 'Vivi', role: 'Freelancer', idname: 'urpieepiee',
            socialLink: 'https://www.youtube.com/@urpieepiee', rating: 5,
            img: './img/vivi.webp',
            text: 'I asked an artist to continue a sketch that was originally done by someone else and the results blew me away! 🎨✨ Each revision added more life and detail, turning a simple sketch into a polished piece full of personality. The process was smooth, fun, and collaborative. Honestly, watching the artwork evolve was just as exciting as seeing the final masterpiece. Couldn’t be happier with how it turned out!',
            type: 'client'
        },
        {
            name: 'Initial J', role: 'Freelancer', idname: 'amrozi',
            socialLink: 'https://www.facebook.com/amrozi.amrozi.5473', rating: 5,
            img: './img/amrozi.webp',
            text: 'Pelayanan super! kualitas dari illuztar tidak bisa diragukan, recommended!',
            type: 'client'
        },
        {
            name: 'MuEltre', role: 'Beginner Illustrator & Designer', idname: 'mueltr3',
            socialLink: 'https://www.instagram.com/mueltr3', rating: 5,
            img: './img/mueltre.webp',
            text: 'Iluztar sangat komunikatif sebagai rekan kerja dan punya pemahaman kuat soal fundamental visual. Arahan dan masukannya baik untuk ilustrasi karakter, background dan logo yang pernah saya kerjakan sangat membantu dan relevan.',
            type: 'collab'
        }
    ],

    portfolioImages: [
        './img/porto1.webp', './img/porto2.webp', './img/porto3.webp',
        './img/porto4.webp', './img/porto5.webp', './img/porto6.webp',
        './img/porto7.webp', './img/porto8.webp', './img/porto9.webp'
    ],

    portfolioData: [
        { id: 'PORT-001', title: 'Library Illustration',          category: 'Personal Illustration',                        number: '01' },
        { id: 'PORT-002', title: 'Character Illustration', category: 'Collaborative Work',                               number: '02' },
        { id: 'PORT-003', title: 'VFX Game Character',            category: 'Game Visual Effects',                 number: '03' },
        { id: 'PORT-004', title: 'Character Design',     category: 'Character Creation',                                number: '04' },
        { id: 'PORT-005', title: 'Character Fanart',       category: 'Fan Art Illustration',                 number: '05' },
        { id: 'PORT-006', title: 'Flat Style Illustration',       category: 'Personal Illustration',  number: '06' },
        { id: 'PORT-007', title: 'Dark Forest Scene',   category: 'Digital Environment',             number: '07' },
        { id: 'PORT-008', title: 'Blue Lake Landscape',  category: 'Digital Environment',                number: '08' },
        { id: 'PORT-009', title: 'Fantasy Cavern',        category: 'Digital Environment',         number: '09' }
    ],

    faqs: [
        {
            questionId: 'Apa itu ILUZTAR?',
            questionEn: 'What is ILUZTAR?',
            answerId:   'ILUZTAR (イルズター) adalah creative studio yang fokus pada anime illustration, graphic branding, dan photo manipulation. Kami juga menjadi collaborative partner untuk artist yang membutuhkan bantuan - We got you!',
            answerEn:   'ILUZTAR (イルズター) is a creative studio focused on anime illustration, graphic branding, and photo manipulation. We also serve as a collaborative partner for artists who need help - We got you!'
        },
        {
            questionId: 'Bagaimana cara order?',
            questionEn: 'How to order?',
            answerId:   'Hubungi kami melalui email atau social media yang tertera di bagian Contact. Jelaskan kebutuhan project Anda, dan kami akan diskusikan detail lebih lanjut!',
            answerEn:   'Contact us via email or social media listed in the Contact section. Explain your project needs, and we\'ll discuss the details further!'
        },
        {
            questionId: 'Apakah ada minimum order?',
            questionEn: 'Is there a minimum order?',
            answerId:   'Tidak ada minimum order. Kami menerima project dari berbagai skala - dari personal commission hingga corporate branding. Setiap project penting bagi kami!',
            answerEn:   'There is no minimum order. We accept projects of various scales - from personal commissions to corporate branding. Every project is important to us!'
        },
        {
            questionId: 'Berapa lama waktu pengerjaan?',
            questionEn: 'How long is the turnaround time?',
            answerId:   'Waktu pengerjaan bervariasi tergantung kompleksitas project. Biasanya 3-14 hari. Kami akan memberikan estimasi yang jelas setelah diskusi awal.',
            answerEn:   'Turnaround time varies depending on project complexity. Usually 3-14 days. We will provide a clear estimate after the initial discussion.'
        },
        {
            questionId: 'Apakah bisa revisi?',
            questionEn: 'Can I request revisions?',
            answerId:   'Ya! Kami menyediakan revisi untuk memastikan hasil sesuai harapan Anda. Detail revisi akan didiskusikan di awal project.',
            answerEn:   'Yes! We provide revisions to ensure the result meets your expectations. Revision details will be discussed at the beginning of the project.'
        },
        {
            questionId: 'Bagaimana sistem pembayaran?',
            questionEn: 'What is the payment system?',
            answerId:   'Pembayaran dilakukan melalui transfer bank atau e-wallet. Biasanya 50% di awal dan 50% setelah project selesai. Detail akan disesuaikan dengan kebutuhan project.',
            answerEn:   'Payment is made via bank transfer or e-wallet. Usually 50% upfront and 50% after project completion. Details will be adjusted according to project needs.'
        }
    ]
};