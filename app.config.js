let deviceLanguage = "en";
try {
  const { getLocales } = require("expo-localization");
  deviceLanguage = getLocales()?.[0]?.languageCode || "en";
} catch (error) {
  console.warn("expo-localization not available, using default language");
  deviceLanguage = "en";
}
const translations = {
  en: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "This app uses your location to provide relevant news in your region.",
        alwaysAndWhenInUse: "This app uses your location to provide relevant news in your region.",
        locationAlways: "Lex uses your location to show news and events in your region.",
        locationWhenInUse: "Lex uses your location only while using the app to provide personalized data.",
      },
      camera: {
        usage:
          "Lex uses the camera to scan legal documents, IDs and other important papers. Your photos are processed locally and used only for document analysis.",
        permission:
          "Lex uses the camera to scan legal documents, IDs and other important papers. Photos are processed locally and not transmitted to the server.",
      },
      gallery: {
        usage: "Lex uses gallery access so you can select and upload photos or documents from your device.",
        permission: "Photo access is needed so you can upload documents and images from your gallery.",
      },
    },
  },
  ru: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "Это приложение использует ваше местоположение для предоставления актуальных новостей в вашем регионе.",
        alwaysAndWhenInUse: "Это приложение использует ваше местоположение для предоставления актуальных новостей в вашем регионе.",
        locationAlways: "Lex использует ваше местоположение, чтобы показывать новости и события в вашем регионе.",
        locationWhenInUse:
          "Lex использует ваше местоположение только во время использования приложения, чтобы предоставлять персонализированные данные.",
      },
      camera: {
        usage:
          "Lex использует камеру для сканирования юридических документов, удостоверений личности и других важных бумаг. Ваши фотографии обрабатываются локально и используются только для анализа документов.",
        permission:
          "Lex использует камеру для сканирования юридических документов, удостоверений личности и других важных бумаг. Фото обрабатываются локально и не передаются на сервер.",
      },
      gallery: {
        usage: "Lex использует доступ к галерее, чтобы вы могли выбрать и загрузить фотографии или документы из своего устройства.",
        permission: "Доступ к фото нужен, чтобы вы могли загружать документы и изображения из вашей галереи.",
      },
    },
  },
  es: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "Esta aplicación utiliza tu ubicación para proporcionar noticias relevantes de tu región.",
        alwaysAndWhenInUse: "Esta aplicación utiliza tu ubicación para proporcionar noticias relevantes de tu región.",
        locationAlways: "Lex utiliza tu ubicación para mostrar noticias y eventos de tu región.",
        locationWhenInUse: "Lex utiliza tu ubicación solo mientras usas la aplicación para proporcionar datos personalizados.",
      },
      camera: {
        usage:
          "Lex utiliza la cámara para escanear documentos legales, identificaciones y otros papeles importantes. Tus fotos se procesan localmente y se utilizan solo para análisis de documentos.",
        permission:
          "Lex utiliza la cámara para escanear documentos legales, identificaciones y otros papeles importantes. Las fotos se procesan localmente y no se transmiten al servidor.",
      },
      gallery: {
        usage: "Lex utiliza el acceso a la galería para que puedas seleccionar y subir fotos o documentos desde tu dispositivo.",
        permission: "Se necesita acceso a las fotos para que puedas subir documentos e imágenes desde tu galería.",
      },
    },
  },
  fr: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "Cette application utilise votre localisation pour fournir des actualités pertinentes dans votre région.",
        alwaysAndWhenInUse: "Cette application utilise votre localisation pour fournir des actualités pertinentes dans votre région.",
        locationAlways: "Lex utilise votre localisation pour afficher les actualités et événements de votre région.",
        locationWhenInUse:
          "Lex utilise votre localisation uniquement pendant l'utilisation de l'application pour fournir des données personnalisées.",
      },
      camera: {
        usage:
          "Lex utilise l'appareil photo pour scanner les documents juridiques, pièces d'identité et autres papiers importants. Vos photos sont traitées localement et utilisées uniquement pour l'analyse de documents.",
        permission:
          "Lex utilise l'appareil photo pour scanner les documents juridiques, pièces d'identité et autres papiers importants. Les photos sont traitées localement et ne sont pas transmises au serveur.",
      },
      gallery: {
        usage: "Lex utilise l'accès à la galerie pour que vous puissiez sélectionner et télécharger des photos ou documents depuis votre appareil.",
        permission: "L'accès aux photos est nécessaire pour que vous puissiez télécharger des documents et images depuis votre galerie.",
      },
    },
  },
  de: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "Diese App verwendet Ihren Standort, um relevante Nachrichten in Ihrer Region bereitzustellen.",
        alwaysAndWhenInUse: "Diese App verwendet Ihren Standort, um relevante Nachrichten in Ihrer Region bereitzustellen.",
        locationAlways: "Lex verwendet Ihren Standort, um Nachrichten und Ereignisse in Ihrer Region anzuzeigen.",
        locationWhenInUse: "Lex verwendet Ihren Standort nur während der App-Nutzung, um personalisierte Daten bereitzustellen.",
      },
      camera: {
        usage:
          "Lex verwendet die Kamera zum Scannen von Rechtsdokumenten, Ausweisen und anderen wichtigen Papieren. Ihre Fotos werden lokal verarbeitet und nur für die Dokumentenanalyse verwendet.",
        permission:
          "Lex verwendet die Kamera zum Scannen von Rechtsdokumenten, Ausweisen und anderen wichtigen Papieren. Fotos werden lokal verarbeitet und nicht an den Server übertragen.",
      },
      gallery: {
        usage: "Lex verwendet den Galerie-Zugriff, damit Sie Fotos oder Dokumente von Ihrem Gerät auswählen und hochladen können.",
        permission: "Fotozugriff ist erforderlich, damit Sie Dokumente und Bilder aus Ihrer Galerie hochladen können.",
      },
    },
  },
  it: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "Questa app utilizza la tua posizione per fornire notizie rilevanti nella tua regione.",
        alwaysAndWhenInUse: "Questa app utilizza la tua posizione per fornire notizie rilevanti nella tua regione.",
        locationAlways: "Lex utilizza la tua posizione per mostrare notizie ed eventi nella tua regione.",
        locationWhenInUse: "Lex utilizza la tua posizione solo durante l'utilizzo dell'app per fornire dati personalizzati.",
      },
      camera: {
        usage:
          "Lex utilizza la fotocamera per scansionare documenti legali, documenti di identità e altri documenti importanti. Le tue foto sono elaborate localmente e utilizzate solo per l'analisi dei documenti.",
        permission:
          "Lex utilizza la fotocamera per scansionare documenti legali, documenti di identità e altri documenti importanti. Le foto sono elaborate localmente e non trasmesse al server.",
      },
      gallery: {
        usage: "Lex utilizza l'accesso alla galleria per permetterti di selezionare e caricare foto o documenti dal tuo dispositivo.",
        permission: "L'accesso alle foto è necessario per permetterti di caricare documenti e immagini dalla tua galleria.",
      },
    },
  },
  pt: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "Este aplicativo usa sua localização para fornecer notícias relevantes em sua região.",
        alwaysAndWhenInUse: "Este aplicativo usa sua localização para fornecer notícias relevantes em sua região.",
        locationAlways: "Lex usa sua localização para mostrar notícias e eventos em sua região.",
        locationWhenInUse: "Lex usa sua localização apenas durante o uso do aplicativo para fornecer dados personalizados.",
      },
      camera: {
        usage:
          "Lex usa a câmera para escanear documentos legais, documentos de identidade e outros papéis importantes. Suas fotos são processadas localmente e usadas apenas para análise de documentos.",
        permission:
          "Lex usa a câmera para escanear documentos legais, documentos de identidade e outros papéis importantes. As fotos são processadas localmente e não transmitidas ao servidor.",
      },
      gallery: {
        usage: "Lex usa o acesso à galeria para que você possa selecionar e enviar fotos ou documentos do seu dispositivo.",
        permission: "O acesso às fotos é necessário para que você possa enviar documentos e imagens da sua galeria.",
      },
    },
  },
  zh: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "此应用程序使用您的位置为您所在地区提供相关新闻。",
        alwaysAndWhenInUse: "此应用程序使用您的位置为您所在地区提供相关新闻。",
        locationAlways: "Lex使用您的位置显示您所在地区的新闻和事件。",
        locationWhenInUse: "Lex仅在使用应用程序时使用您的位置来提供个性化数据。",
      },
      camera: {
        usage: "Lex使用相机扫描法律文件、身份证件和其他重要文件。您的照片在本地处理，仅用于文档分析。",
        permission: "Lex使用相机扫描法律文件、身份证件和其他重要文件。照片在本地处理，不会传输到服务器。",
      },
      gallery: {
        usage: "Lex使用图库访问权限，以便您可以从设备中选择和上传照片或文档。",
        permission: "需要照片访问权限，以便您可以从图库上传文档和图像。",
      },
    },
  },
  ja: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "このアプリはあなたの地域の関連ニュースを提供するためにあなたの位置情報を使用します。",
        alwaysAndWhenInUse: "このアプリはあなたの地域の関連ニュースを提供するためにあなたの位置情報を使用します。",
        locationAlways: "Lexはあなたの地域のニュースやイベントを表示するためにあなたの位置情報を使用します。",
        locationWhenInUse: "Lexはパーソナライズされたデータを提供するために、アプリ使用中のみあなたの位置情報を使用します。",
      },
      camera: {
        usage:
          "Lexは法的文書、身分証明書、その他の重要な書類をスキャンするためにカメラを使用します。あなたの写真はローカルで処理され、文書分析のためだけに使用されます。",
        permission:
          "Lexは法的文書、身分証明書、その他の重要な書類をスキャンするためにカメラを使用します。写真はローカルで処理され、サーバーには送信されません。",
      },
      gallery: {
        usage: "Lexはあなたのデバイスから写真や文書を選択してアップロードできるようにするためにギャラリーアクセスを使用します。",
        permission: "ギャラリーから文書や画像をアップロードするために写真アクセスが必要です。",
      },
    },
  },
  ko: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "이 앱은 귀하의 지역에서 관련 뉴스를 제공하기 위해 귀하의 위치를 사용합니다.",
        alwaysAndWhenInUse: "이 앱은 귀하의 지역에서 관련 뉴스를 제공하기 위해 귀하의 위치를 사용합니다.",
        locationAlways: "Lex는 귀하의 지역에서 뉴스와 이벤트를 표시하기 위해 귀하의 위치를 사용합니다.",
        locationWhenInUse: "Lex는 개인화된 데이터를 제공하기 위해 앱 사용 중에만 귀하의 위치를 사용합니다.",
      },
      camera: {
        usage:
          "Lex는 법적 문서, 신분증 및 기타 중요한 서류를 스캔하기 위해 카메라를 사용합니다. 귀하의 사진은 로컬에서 처리되며 문서 분석에만 사용됩니다.",
        permission:
          "Lex는 법적 문서, 신분증 및 기타 중요한 서류를 스캔하기 위해 카메라를 사용합니다. 사진은 로컬에서 처리되며 서버로 전송되지 않습니다.",
      },
      gallery: {
        usage: "Lex는 귀하의 장치에서 사진이나 문서를 선택하고 업로드할 수 있도록 갤러리 액세스를 사용합니다.",
        permission: "갤러리에서 문서와 이미지를 업로드하기 위해 사진 액세스가 필요합니다.",
      },
    },
  },
  ar: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "يستخدم هذا التطبيق موقعك لتوفير الأخبار ذات الصلة في منطقتك.",
        alwaysAndWhenInUse: "يستخدم هذا التطبيق موقعك لتوفير الأخبار ذات الصلة في منطقتك.",
        locationAlways: "يستخدم Lex موقعك لإظهار الأخبار والأحداث في منطقتك.",
        locationWhenInUse: "يستخدم Lex موقعك فقط أثناء استخدام التطبيق لتوفير بيانات مخصصة.",
      },
      camera: {
        usage:
          "يستخدم Lex الكاميرا لمسح الوثائق القانونية وبطاقات الهوية والأوراق المهمة الأخرى. يتم معالجة صورك محلياً وتُستخدم فقط لتحليل الوثائق.",
        permission:
          "يستخدم Lex الكاميرا لمسح الوثائق القانونية وبطاقات الهوية والأوراق المهمة الأخرى. يتم معالجة الصور محلياً ولا يتم إرسالها إلى الخادم.",
      },
      gallery: {
        usage: "يستخدم Lex الوصول إلى المعرض حتى تتمكن من تحديد وتحميل الصور أو الوثائق من جهازك.",
        permission: "الوصول إلى الصور مطلوب حتى تتمكن من تحميل الوثائق والصور من معرضك.",
      },
    },
  },
  hi: {
    appName: "LexHelps",
    permissions: {
      location: {
        whenInUse: "यह ऐप आपके क्षेत्र में प्रासंगिक समाचार प्रदान करने के लिए आपके स्थान का उपयोग करता है।",
        alwaysAndWhenInUse: "यह ऐप आपके क्षेत्र में प्रासंगिक समाचार प्रदान करने के लिए आपके स्थान का उपयोग करता है।",
        locationAlways: "Lex आपके क्षेत्र में समाचार और घटनाओं को दिखाने के लिए आपके स्थान का उपयोग करता है।",
        locationWhenInUse: "Lex व्यक्तिगत डेटा प्रदान करने के लिए केवल ऐप का उपयोग करते समय आपके स्थान का उपयोग करता है।",
      },
      camera: {
        usage:
          "Lex कानूनी दस्तावेजों, पहचान पत्रों और अन्य महत्वपूर्ण कागजातों को स्कैन करने के लिए कैमरे का उपयोग करता है। आपकी तस्वीरें स्थानीय रूप से संसाधित होती हैं और केवल दस्तावेज़ विश्लेषण के लिए उपयोग की जाती हैं।",
        permission:
          "Lex कानूनी दस्तावेजों, पहचान पत्रों और अन्य महत्वपूर्ण कागजातों को स्कैन करने के लिए कैमरे का उपयोग करता है। तस्वीरें स्थानीय रूप से संसाधित होती हैं और सर्वर पर नहीं भेजी जातीं।",
      },
      gallery: {
        usage: "Lex गैलरी एक्सेस का उपयोग करता है ताकि आप अपने डिवाइस से फोटो या दस्तावेज़ चुन सकें और अपलोड कर सकें।",
        permission: "आपकी गैलरी से दस्तावेज़ और छवियों को अपलोड करने के लिए फोटो एक्सेस की आवश्यकता है।",
      },
    },
  },
};

// Безопасное получение перевода с fallback на английский
const getTranslation = (key) => {
  const keys = key.split(".");
  let result = translations[deviceLanguage] || translations.en;

  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) {
      // Fallback to English if translation not found
      let enResult = translations.en;
      for (const enK of keys) {
        enResult = enResult?.[enK];
        if (enResult === undefined) return key; // Если даже в английском нет, вернем ключ
      }
      return enResult;
    }
  }

  return result || key;
};
export default {
  expo: {
    name: getTranslation("appName"),
    slug: "LexHelps",
    version: "1.0.30",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "LexHelps",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cdlcarolinas.lex",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription: getTranslation("permissions.location.whenInUse"),
        NSLocationAlwaysAndWhenInUseUsageDescription: getTranslation("permissions.location.alwaysAndWhenInUse"),
        NSCameraUsageDescription: getTranslation("permissions.camera.usage"),
        NSPhotoLibraryUsageDescription: getTranslation("permissions.gallery.usage"),
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.cdlcarolinas.lex",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.CAMERA",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: getTranslation("permissions.location.locationAlways"),
          locationWhenInUsePermission: getTranslation("permissions.location.locationWhenInUse"),
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: getTranslation("permissions.camera.permission"),
        },
      ],
      [
        "expo-image-picker",
        {
          cameraPermission: getTranslation("permissions.camera.permission"),
          photosPermission: getTranslation("permissions.gallery.permission"),
        },
      ],
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
    },
    submit: {
      production: {
        ios: {
          appleId: "yesdoni@icloud.com",
          ascAppId: "6747161585",
          appleTeamId: "3SZQ9MW3F4",
        },
      },
    },
    extra: {
      router: {},
      eas: {
        projectId: "890d9bd2-badc-41f2-b5ea-100f99d5d35b",
      },
    },
  },
};
