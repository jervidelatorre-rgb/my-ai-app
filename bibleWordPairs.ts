import { BibleCategory, BibleWordPair } from '../types/game';

export const INITIAL_BIBLE_WORD_PAIRS: BibleWordPair[] = [
  // --- BIBLICAL CHARACTERS ---
  {
    id: 'char-1',
    category: 'characters',
    word1: 'Moses',
    word2: 'Aaron',
    hintOrScripture: 'Brothers chosen by God during the Exodus (Exodus 4:14)'
  },
  {
    id: 'char-2',
    category: 'characters',
    word1: 'David',
    word2: 'Solomon',
    hintOrScripture: 'Father and son Kings of Israel, poet and sage (1 Kings 2:1-4)'
  },
  {
    id: 'char-3',
    category: 'characters',
    word1: 'Peter',
    word2: 'Paul',
    hintOrScripture: 'Early church apostles who preached with bold fervor (Galatians 2:8)'
  },
  {
    id: 'char-4',
    category: 'characters',
    word1: 'Abraham',
    word2: 'Isaac',
    hintOrScripture: 'Father of faith and his son of promise on Mount Moriah (Genesis 22)'
  },
  {
    id: 'char-5',
    category: 'characters',
    word1: 'Elijah',
    word2: 'Elisha',
    hintOrScripture: 'The chariot-of-fire prophet and his double-portion successor (2 Kings 2:9)'
  },
  {
    id: 'char-6',
    category: 'characters',
    word1: 'Mary',
    word2: 'Martha',
    hintOrScripture: 'Sisters of Lazarus who welcomed Jesus into their home (Luke 10:38-42)'
  },
  {
    id: 'char-7',
    category: 'characters',
    word1: 'Cain',
    word2: 'Abel',
    hintOrScripture: 'Firstborn brothers who brought different offerings to the Lord (Genesis 4)'
  },
  {
    id: 'char-8',
    category: 'characters',
    word1: 'Noah',
    word2: 'Jonah',
    hintOrScripture: 'Preachers whose lives were centered around great waters and obedience (Genesis 6 / Jonah 1)'
  },
  {
    id: 'char-9',
    category: 'characters',
    word1: 'Joshua',
    word2: 'Caleb',
    hintOrScripture: 'The two courageous spies who trusted God would deliver the Promised Land (Numbers 14:6-9)'
  },
  {
    id: 'char-10',
    category: 'characters',
    word1: 'Ruth',
    word2: 'Esther',
    hintOrScripture: 'Devout Old Testament heroines with books bearing their names (Ruth 1 / Esther 4)'
  },
  {
    id: 'char-11',
    category: 'characters',
    word1: 'Samson',
    word2: 'Gideon',
    hintOrScripture: 'Judges who delivered Israel through miraculous divine strength (Judges 7 / Judges 16)'
  },
  {
    id: 'char-12',
    category: 'characters',
    word1: 'Daniel',
    word2: 'Joseph',
    hintOrScripture: 'Faithful dream interpreters elevated to high rank in foreign empires (Genesis 41 / Daniel 2)'
  },
  {
    id: 'char-13',
    category: 'characters',
    word1: 'John the Baptist',
    word2: 'Elijah',
    hintOrScripture: 'Prophets of the wilderness dressed in camel hair (Matthew 11:14)'
  },
  {
    id: 'char-14',
    category: 'characters',
    word1: 'Jacob',
    word2: 'Esau',
    hintOrScripture: 'Twin brothers who wrestled over a birthright and blessing (Genesis 25)'
  },
  {
    id: 'char-15',
    category: 'characters',
    word1: 'Jonathan',
    word2: 'David',
    hintOrScripture: 'A bond of loyal friendship deeper than brothers (1 Samuel 18:1-4)'
  },
  {
    id: 'char-16',
    category: 'characters',
    word1: 'Sarah',
    word2: 'Hagar',
    hintOrScripture: 'Mothers of Isaac and Ishmael in Abraham’s household (Genesis 16 & 21)'
  },
  {
    id: 'char-17',
    category: 'characters',
    word1: 'Barnabas',
    word2: 'Silas',
    hintOrScripture: 'Faithful missionary companions who traveled alongside Paul (Acts 15)'
  },
  {
    id: 'char-18',
    category: 'characters',
    word1: 'Nicodemus',
    word2: 'Joseph of Arimathea',
    hintOrScripture: 'Council members who secretly loved Jesus and buried His body (John 19:38-40)'
  },
  {
    id: 'char-19',
    category: 'characters',
    word1: 'Matthew',
    word2: 'Luke',
    hintOrScripture: 'Gospel writers: the former tax collector and the beloved physician (Matthew 9:9 / Colossians 4:14)'
  },
  {
    id: 'char-20',
    category: 'characters',
    word1: 'Adam',
    word2: 'Noah',
    hintOrScripture: 'Fathers of new beginnings entrusted with caring for God’s creation (Genesis 2 / Genesis 9)'
  },
  {
    id: 'char-21',
    category: 'characters',
    word1: 'Deborah',
    word2: 'Miriam',
    hintOrScripture: 'Wise prophetesses who sang songs of deliverance for Israel (Exodus 15 / Judges 5)'
  },
  {
    id: 'char-22',
    category: 'characters',
    word1: 'Stephen',
    word2: 'Philip',
    hintOrScripture: 'Chosen deacons full of faith and the Holy Spirit (Acts 6-8)'
  },
  {
    id: 'char-23',
    category: 'characters',
    word1: 'Samuel',
    word2: 'Eli',
    hintOrScripture: 'The young boy who heard God whisper and the high priest in Shiloh (1 Samuel 3)'
  },

  // --- BIBLICAL PLACES ---
  {
    id: 'place-1',
    category: 'places',
    word1: 'Bethlehem',
    word2: 'Nazareth',
    hintOrScripture: 'Jesus’ birthplace and His boyhood hometown (Luke 2:4)'
  },
  {
    id: 'place-2',
    category: 'places',
    word1: 'Jerusalem',
    word2: 'Jericho',
    hintOrScripture: 'The Holy City on Zion and the palm city down the mountain road (Luke 10:30)'
  },
  {
    id: 'place-3',
    category: 'places',
    word1: 'Mount Sinai',
    word2: 'Mount Carmel',
    hintOrScripture: 'Mountain of the Commandments and mountain of Elijah’s altar of fire (Exodus 19 / 1 Kings 18)'
  },
  {
    id: 'place-4',
    category: 'places',
    word1: 'Garden of Eden',
    word2: 'Garden of Gethsemane',
    hintOrScripture: 'Garden where humanity fell and garden where Jesus surrendered in prayer (Genesis 3 / Matthew 26:36)'
  },
  {
    id: 'place-5',
    category: 'places',
    word1: 'Egypt',
    word2: 'Babylon',
    hintOrScripture: 'Great ancient empires where Israel endured captivity and exile (Exodus 1 / Psalm 137)'
  },
  {
    id: 'place-6',
    category: 'places',
    word1: 'Red Sea',
    word2: 'Jordan River',
    hintOrScripture: 'Waters miraculously parted by God for His people to cross on dry ground (Exodus 14 / Joshua 3)'
  },
  {
    id: 'place-7',
    category: 'places',
    word1: 'Sea of Galilee',
    word2: 'Dead Sea',
    hintOrScripture: 'Living freshwater where Jesus walked on waves vs salt sea where nothing swims (Matthew 14:25)'
  },
  {
    id: 'place-8',
    category: 'places',
    word1: 'Antioch',
    word2: 'Damascus',
    hintOrScripture: 'Where believers were first named Christians and the road to Paul’s conversion (Acts 9 / Acts 11:26)'
  },
  {
    id: 'place-9',
    category: 'places',
    word1: 'Nineveh',
    word2: 'Tarshish',
    hintOrScripture: 'The city God commanded Jonah to warn and the far destination he fled toward (Jonah 1:2-3)'
  },
  {
    id: 'place-10',
    category: 'places',
    word1: 'Mount of Olives',
    word2: 'Mount Zion',
    hintOrScripture: 'Sacred hills overlooking Jerusalem where prophecies and worship abide (Acts 1:12 / Psalm 48:2)'
  },
  {
    id: 'place-11',
    category: 'places',
    word1: 'Ephesus',
    word2: 'Corinth',
    hintOrScripture: 'Major Greek/Roman coastal cities where Paul planted thriving churches (1 Corinthians / Ephesians)'
  },
  {
    id: 'place-12',
    category: 'places',
    word1: 'Capernaum',
    word2: 'Bethsaida',
    hintOrScripture: 'Lakeside fishing towns where Jesus performed many of His mightiest miracles (Matthew 11:21-23)'
  },
  {
    id: 'place-13',
    category: 'places',
    word1: 'Golgotha',
    word2: 'Garden Tomb',
    hintOrScripture: 'The Place of the Skull and the empty tomb of resurrection morning (John 19:17 / John 20)'
  },
  {
    id: 'place-14',
    category: 'places',
    word1: 'Tower of Babel',
    word2: 'City of Sodom',
    hintOrScripture: 'Places in Genesis marked by human rebellion and divine intervention (Genesis 11 / Genesis 19)'
  },
  {
    id: 'place-15',
    category: 'places',
    word1: 'Patmos',
    word2: 'Rome',
    hintOrScripture: 'John’s island of the Revelation and Paul’s final destination in chains (Revelation 1:9 / Acts 28)'
  },
  {
    id: 'place-16',
    category: 'places',
    word1: 'Ur of the Chaldeans',
    word2: 'Haran',
    hintOrScripture: 'Ancient cities where Abraham received God’s call to leave his fatherland (Genesis 11:31 - 12:1)'
  },

  // --- BIBLICAL OBJECTS & EVENTS ---
  {
    id: 'obj-1',
    category: 'objects_events',
    word1: 'Noah’s Ark',
    word2: 'Ark of the Covenant',
    hintOrScripture: 'Vessel of timber preserving life and golden chest carrying God’s holy presence (Genesis 6 / Exodus 25)'
  },
  {
    id: 'obj-2',
    category: 'objects_events',
    word1: 'Ten Commandments',
    word2: 'Sermon on the Mount',
    hintOrScripture: 'God’s covenant law carved on stone and Jesus’ teaching of the Beatitudes (Exodus 20 / Matthew 5)'
  },
  {
    id: 'obj-3',
    category: 'objects_events',
    word1: 'Burning Bush',
    word2: 'Pillar of Fire',
    hintOrScripture: 'Holy fire that burned without consuming and fire that guided Israel by night (Exodus 3:2 / Exodus 13:21)'
  },
  {
    id: 'obj-4',
    category: 'objects_events',
    word1: 'Manna from Heaven',
    word2: 'Loaves and Fishes',
    hintOrScripture: 'Miraculous bread sent in the wilderness and the feast multiplied for five thousand (Exodus 16 / John 6)'
  },
  {
    id: 'obj-5',
    category: 'objects_events',
    word1: 'David’s Sling',
    word2: 'Moses’ Staff',
    hintOrScripture: 'Humble shepherd tools used by God to fell a giant and part an ocean (1 Samuel 17:40 / Exodus 14:16)'
  },
  {
    id: 'obj-6',
    category: 'objects_events',
    word1: 'Golden Calf',
    word2: 'Bronze Serpent',
    hintOrScripture: 'An idol crafted in Sinai rebellion vs a bronze standard lifted for healing (Exodus 32 / Numbers 21)'
  },
  {
    id: 'obj-7',
    category: 'objects_events',
    word1: 'The Last Supper',
    word2: 'Passover Feast',
    hintOrScripture: 'The holy meal inaugurating communion and the original feast of redemption (Luke 22:14-20 / Exodus 12)'
  },
  {
    id: 'obj-8',
    category: 'objects_events',
    word1: 'Joseph’s Coat',
    word2: 'Jesus’ Robe',
    hintOrScripture: 'The coat of many colors and the seamless tunic soldiers cast lots for (Genesis 37:3 / John 19:23)'
  },
  {
    id: 'obj-9',
    category: 'objects_events',
    word1: 'Crown of Thorns',
    word2: 'Crown of Life',
    hintOrScripture: 'The crown of mockery at the cross and the eternal reward promised to believers (Matthew 27:29 / James 1:12)'
  },
  {
    id: 'obj-10',
    category: 'objects_events',
    word1: 'Pentecost Fire',
    word2: 'Babel Tongues',
    hintOrScripture: 'The Holy Spirit uniting languages vs tongues scattered in confusion (Acts 2:3 / Genesis 11:7)'
  },
  {
    id: 'obj-11',
    category: 'objects_events',
    word1: 'Water into Wine',
    word2: 'Walking on Water',
    hintOrScripture: 'Jesus’ first miracle at Cana and His mastery over the stormy sea (John 2 / Matthew 14)'
  },
  {
    id: 'obj-12',
    category: 'objects_events',
    word1: 'Trumpets of Jericho',
    word2: 'Gideon’s Jars and Torches',
    hintOrScripture: 'Unconventional battle weapons used to conquer walled cities and armies (Joshua 6 / Judges 7)'
  },
  {
    id: 'obj-13',
    category: 'objects_events',
    word1: 'Altar of Incense',
    word2: 'Table of Showbread',
    hintOrScripture: 'Sacred Tabernacle furnishings symbolizing continuous prayer and fellowship (Exodus 30 / Exodus 25)'
  },
  {
    id: 'obj-14',
    category: 'objects_events',
    word1: 'Dove with Olive Branch',
    word2: 'Dove at Jesus’ Baptism',
    hintOrScripture: 'Symbol of peace after the flood and the Holy Spirit descending like a dove (Genesis 8:11 / Matthew 3:16)'
  },
  {
    id: 'obj-15',
    category: 'objects_events',
    word1: 'The Cross',
    word2: 'The Empty Tomb',
    hintOrScripture: 'The place of Christ’s sacrifice and the triumphant sign of His resurrection (1 Corinthians 1:18 / Luke 24:6)'
  },
  {
    id: 'obj-16',
    category: 'objects_events',
    word1: 'Fruit of Good and Evil',
    word2: 'Fruit of the Spirit',
    hintOrScripture: 'The forbidden fruit in Eden vs the virtues harvested by faith (Genesis 3 / Galatians 5:22-23)'
  }
];

export const CATEGORY_LABELS: Record<BibleCategory, { name: string; description: string; icon: string }> = {
  characters: {
    name: 'Biblical Characters',
    description: 'Prophets, apostles, kings, and matriarchs',
    icon: 'Users'
  },
  places: {
    name: 'Biblical Places',
    description: 'Holy cities, sacred mountains, and historic waters',
    icon: 'MapPin'
  },
  objects_events: {
    name: 'Objects & Events',
    description: 'Sacred artifacts, miracles, and historic covenants',
    icon: 'Scroll'
  },
  custom: {
    name: 'Custom Word Pairs',
    description: 'Community-added Bible pairs for your youth group or church',
    icon: 'Sparkles'
  }
};
