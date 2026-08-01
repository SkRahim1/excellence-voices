const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyANSnox_vpsSxeh2gQen3RLM6GWwBuZpHc",
  authDomain: "excellence-voices.firebaseapp.com",
  projectId: "excellence-voices",
  storageBucket: "excellence-voices.firebasestorage.app",
  messagingSenderId: "913710073561",
  appId: "1:913710073561:web:63d7bb6b307d0ec3ad60c8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const allActionWordsContent = `1. wake: wake, woke, woken, waking, will wake
2. sleep: sleep, slept, slept, sleeping, will sleep
3. eat: eat, ate, eaten, eating, will eat
4. drink: drink, drank, drunk, drinking, will drink
5. bathe: bathe, bathed, bathed, bathing, will bathe
6. brush: brush, brushed, brushed, brushing, will brush
7. wash: wash, washed, washed, washing, will wash
8. comb: comb, combed, combed, combing, will comb
9. dress: dress, dressed, dressed, dressing, will dress
10. cook: cook, cooked, cooked, cooking, will cook
11. clean: clean, cleaned, cleaned, cleaning, will clean
12. sweep: sweep, swept, swept, sweeping, will sweep
13. mop: mop, mopped, mopped, mopping, will mop
14. dust: dust, dusted, dusted, dusting, will dust
15. iron: iron, ironed, ironed, ironing, will iron
16. fold: fold, folded, folded, folding, will fold
17. pack: pack, packed, packed, packing, will pack
18. study: study, studied, studied, studying, will study
19. learn: learn, learned, learned, learning, will learn
20. read: read, read, read, reading, will read
21. go: go, went, gone, going, will go
22. come: come, came, come, coming, will come
23. walk: walk, walked, walked, walking, will walk
24. run: run, ran, run, running, will run
25. jump: jump, jumped, jumped, jumping, will jump
26. hop: hop, hopped, hopped, hopping, will hop
27. skip: skip, skipped, skipped, skipping, will skip
28. crawl: crawl, crawled, crawled, crawling, will crawl
29. climb: climb, climbed, climbed, climbing, will climb
30. fall: fall, fell, fallen, falling, will fall
31. rise: rise, rose, risen, rising, will rise
32. sit: sit, sat, sat, sitting, will sit
33. stand: stand, stood, stood, standing, will stand
34. bend: bend, bent, bent, bending, will bend
35. stretch: stretch, stretched, stretched, stretching, will stretch
36. turn: turn, turned, turned, turning, will turn
37. spin: spin, spun, spun, spinning, will spin
38. slide: slide, slid, slid, sliding, will slide
39. swing: swing, swung, swung, swinging, will swing
40. fly: fly, flew, flown, flying, will fly
41. drive: drive, drove, driven, driving, will drive
42. ride: ride, rode, ridden, riding, will ride
43. swim: swim, swam, swum, swimming, will swim
44. travel: travel, traveled, traveled, traveling, will travel
45. sail: sail, sailed, sailed, sailing, will sail
46. row: row, rowed, rowed, rowing, will row
47. cross: cross, crossed, crossed, crossing, will cross
48. reach: reach, reached, reached, reaching, will reach
49. leave: leave, left, left, leaving, will leave
50. arrive: arrive, arrived, arrived, arriving, will arrive
51. stop: stop, stopped, stopped, stopping, will stop
52. start: start, started, started, starting, will start
53. wait: wait, waited, waited, waiting, will wait
54. park: park, parked, parked, parking, will park
55. board: board, boarded, boarded, boarding, will board
56. enter: enter, entered, entered, entering, will enter
57. exit: exit, exited, exited, exiting, will exit
58. follow: follow, followed, followed, following, will follow
59. lead: lead, led, led, leading, will lead
60. return: return, returned, returned, returning, will return
61. speak: speak, spoke, spoken, speaking, will speak
62. talk: talk, talked, talked, talking, will talk
63. say: say, said, said, saying, will say
64. tell: tell, told, told, telling, will tell
65. ask: ask, asked, asked, asking, will ask
66. answer: answer, answered, answered, answering, will answer
67. call: call, called, called, calling, will call
68. shout: shout, shouted, shouted, shouting, will shout
69. whisper: whisper, whispered, whispered, whispering, will whisper
70. scream: scream, screamed, screamed, screaming, will scream
71. sing: sing, sang, sung, singing, will sing
72. hum: hum, hummed, hummed, humming, will hum
73. whistle: whistle, whistled, whistled, whistling, will whistle
74. laugh: laugh, laughed, laughed, laughing, will laugh
75. smile: smile, smiled, smiled, smiling, will smile
76. cry: cry, cried, cried, crying, will cry
77. weep: weep, wept, wept, weeping, will weep
78. frown: frown, frowned, frowned, frowning, will frown
79. wave: wave, waved, waved, waving, will wave
80. nod: nod, nodded, nodded, nodding, will nod
81. take: take, took, taken, taking, will take
82. give: give, gave, given, giving, will give
83. bring: bring, brought, brought, bringing, will bring
84. carry: carry, carried, carried, carrying, will carry
85. push: push, pushed, pushed, pushing, will push
86. pull: pull, pulled, pulled, pulling, will pull
87. lift: lift, lifted, lifted, lifting, will lift
88. drop: drop, dropped, dropped, dropping, will drop
89. hold: hold, held, held, holding, will hold
90. catch: catch, caught, caught, catching, will catch
91. throw: throw, threw, thrown, throwing, will throw
92. hit: hit, hit, hit, hitting, will hit
93. kick: kick, kicked, kicked, kicking, will kick
94. touch: touch, touched, touched, touching, will touch
95. press: press, pressed, pressed, pressing, will press
96. shake: shake, shook, shaken, shaking, will shake
97. squeeze: squeeze, squeezed, squeezed, squeezing, will squeeze
98. pinch: pinch, pinched, pinched, pinching, will pinch
99. scratch: scratch, scratched, scratched, scratching, will scratch
100. rub: rub, rubbed, rubbed, rubbing, will rub
101. cut: cut, cut, cut, cutting, will cut
102. chop: chop, chopped, chopped, chopping, will chop
103. slice: slice, sliced, sliced, slicing, will slice
104. peel: peel, peeled, peeled, peeling, will peel
105. boil: boil, boiled, boiled, boiling, will boil
106. fry: fry, fried, fried, frying, will fry
107. bake: bake, baked, baked, baking, will bake
108. stir: stir, stirred, stirred, stirring, will stir
109. mix: mix, mixed, mixed, mixing, will mix
110. pour: pour, poured, poured, pouring, will pour
111. open: open, opened, opened, opening, will open
112. close: close, closed, closed, closing, will close
113. lock: lock, locked, locked, locking, will lock
114. unlock: unlock, unlocked, unlocked, unlocking, will unlock
115. switch: switch, switched, switched, switching, will switch
116. ring: ring, rang, rung, ringing, will ring
117. knock: knock, knocked, knocked, knocking, will knock
118. scrub: scrub, scrubbed, scrubbed, scrubbing, will scrub
119. wipe: wipe, wiped, wiped, wiping, will wipe
120. dry: dry, dried, dried, drying, will dry
121. see: see, saw, seen, seeing, will see
122. look: look, looked, looked, looking, will look
123. watch: watch, watched, watched, watching, will watch
124. hear: hear, heard, heard, hearing, will hear
125. listen: listen, listened, listened, listening, will listen
126. smell: smell, smelled, smelled, smelling, will smell
127. taste: taste, tasted, tasted, tasting, will taste
128. feel: feel, felt, felt, feeling, will feel
129. think: think, thought, thought, thinking, will think
130. know: know, knew, known, knowing, will know
131. believe: believe, believed, believed, believing, will believe
132. understand: understand, understood, understood, understanding, will understand
133. remember: remember, remembered, remembered, remembering, will remember
134. forget: forget, forgot, forgotten, forgetting, will forget
135. like: like, liked, liked, liking, will like
136. love: love, loved, loved, loving, will love
137. hate: hate, hated, hated, hating, will hate
138. want: want, wanted, wanted, wanting, will want
139. need: need, needed, needed, needing, will need
140. hope: hope, hoped, hoped, hoping, will hope
141. draw: draw, drew, drawn, drawing, will draw
142. color: color, colored, colored, coloring, will color
143. paint: paint, painted, painted, painting, will paint
144. erase: erase, erased, erased, erasing, will erase
145. spell: spell, spelled, spelled, spelling, will spell
146. count: count, counted, counted, counting, will count
147. solve: solve, solved, solved, solving, will solve
148. copy: copy, copied, copied, copying, will copy
149. paste: paste, pasted, pasted, pasting, will paste
150. tear: tear, tore, torn, tearing, will tear
151. glue: glue, glued, glued, gluing, will glue
152. highlight: highlight, highlighted, highlighted, highlighting, will highlight
153. explain: explain, explained, explained, explaining, will explain
154. describe: describe, described, described, describing, will describe
155. discuss: discuss, discussed, discussed, discussing, will discuss
156. focus: focus, focused, focused, focusing, will focus
157. memorize: memorize, memorized, memorized, memorizing, will memorize
158. check: check, checked, checked, checking, will check
159. correct: correct, corrected, corrected, correcting, will correct
160. submit: submit, submitted, submitted, submitting, will submit
161. buy: buy, bought, bought, buying, will buy
162. sell: sell, sold, sold, selling, will sell
163. pay: pay, paid, paid, paying, will pay
164. spend: spend, spent, spent, spending, will spend
165. save: save, saved, saved, saving, will save
166. borrow: borrow, borrowed, borrowed, borrowing, will borrow
167. lend: lend, lent, lent, lending, will lend
168. earn: earn, earned, earned, earning, will earn
169. lose: lose, lost, lost, losing, will lose
170. find: find, found, found, finding, will find
171. choose: choose, chose, chosen, choosing, will choose
172. select: select, selected, selected, selecting, will select
173. cost: cost, cost, cost, costing, will cost
174. rent: rent, rented, rented, renting, will rent
175. hire: hire, hired, hired, hiring, will hire
176. exchange: exchange, exchanged, exchanged, exchanging, will exchange
177. replace: replace, replaced, replaced, replacing, will replace
178. order: order, ordered, ordered, ordering, will order
179. deliver: deliver, delivered, delivered, delivering, will deliver
180. receive: receive, received, received, receiving, will receive
181. work: work, worked, worked, working, will work
182. build: build, built, built, building, will build
183. make: make, made, made, making, will make
184. fix: fix, fixed, fixed, fixing, will fix
185. repair: repair, repaired, repaired, repairing, will repair
186. break: break, broke, broken, breaking, will break
187. destroy: destroy, destroyed, destroyed, destroying, will destroy
188. create: create, created, created, creating, will create
189. design: design, designed, designed, designing, will design
190. grow: grow, grew, grown, growing, will grow
191. plant: plant, planted, planted, planting, will plant
192. water: water, watered, watered, watering, will water
193. feed: feed, fed, fed, feeding, will feed
194. dig: dig, dug, dug, digging, will dig
195. hide: hide, hid, hidden, hiding, will hide
196. seek: seek, sought, sought, seeking, will seek
197. search: search, searched, searched, searching, will search
198. share: share, shared, shared, sharing, will share
199. join: join, joined, joined, joining, will join
200. divide: divide, divided, divided, dividing, will divide`;

const instructionsSets = [
  {
    id: 1,
    title: "1. Classroom Etiquette",
    content: `Do's:
1. Listen attentively when the teacher is explaining lessons.
2. Raise your hand and wait to be called on before speaking.
3. Keep your desk clean and organize your study materials.
4. Greet teachers and classmates politely every morning.
5. Follow class rules and instructions immediately.
6. Speak in a gentle, indoor voice during group activities.
7. Help classmates if they do not understand a task.
8. Bring all required books and stationery to class daily.
9. Sit in a proper, active posture during study hours.
10. Say 'please' and 'thank you' when interacting.

Don'ts:
1. Do not interrupt teachers or classmates when they speak.
2. Do not litter in the classroom; use the dustbin.
3. Do not write, scratch, or scribble on school desks or walls.
4. Do not eat snacks or chew gum during teaching hours.
5. Do not run or jump over benches inside the classroom.
6. Do not make noise or disturb classmates while studying.
7. Do not use abusive or disrespectful words with anyone.
8. Do not mock or laugh at a classmate's mistakes.
9. Do not leave the classroom without the teacher's permission.
10. Do not damage school property or classroom displays.`
  },
  {
    id: 2,
    title: "2. Playground & Outdoors",
    content: `Do's:
1. Play fair and follow the rules of the game.
2. Include everyone in games and make new friends.
3. Wait patiently for your turn on slides and swings.
4. Encourage and cheer for your team members.
5. Return play equipment to the sports room after use.
6. Listen to the physical training teacher's guidelines.
7. Shake hands and congratulate the winning team.
8. Stay within the school playground boundary lines.
9. Wear proper sports shoes and uniform for safety.
10. Report any accidents or injuries to a teacher immediately.

Don'ts:
1. Do not push, pull, or trip classmates while playing.
2. Do not tease or make fun of the team that loses.
3. Do not throw sports equipment at anyone out of anger.
4. Do not fight or use physical force to resolve disagreements.
5. Do not play in wet, muddy, or unsafe ground areas.
6. Do not climb on fences, gates, or thin tree branches.
7. Do not pick up or throw sharp stones or sticks.
8. Do not argue disrespectfully with the referee or coach.
9. Do not hide in remote or unsupervised school areas.
10. Do not litter food wrappers on the playground grass.`
  },
  {
    id: 3,
    title: "3. Digital & Online Safety",
    content: `Do's:
1. Keep your computer login passwords private and secure.
2. Report any inappropriate online message to a teacher.
3. Use polite and respectful language in online chats.
4. Share digital devices fairly during lab sessions.
5. Shut down computers properly after finishing work.
6. Double-check sources before copying research details.
7. Raise your hand if you experience technical problems.
8. Follow instructions on which learning websites to visit.
9. Keep headphones at a safe, comfortable audio level.
10. Keep the computer lab clean and place chairs back.

Don'ts:
1. Do not share personal details like home address or phone.
2. Do not visit unauthorized websites or download files.
3. Do not change computer settings or delete system files.
4. Do not post or share unkind comments about classmates.
5. Do not bring food items or water near computers.
6. Do not chat online with strangers during class hours.
7. Do not touch electrical cables or sockets in the lab.
8. Do not copy others' homework or digital projects.
9. Do not use digital devices during lectures without asking.
10. Do not click on pop-ups or download unknown programs.`
  },
  {
    id: 4,
    title: "4. Health & Hygiene",
    content: `Do's:
1. Wash hands with soap before eating and after toilet.
2. Use a clean handkerchief or tissue when you sneeze.
3. Keep your hair combed and fingernails trimmed neatly.
4. Wear clean, ironed school uniform and socks daily.
5. Drink plenty of clean water from your bottle.
6. Keep toilets clean and flush properly after use.
7. Dispose of sanitary waste in designated trash bins.
8. Eat a balanced lunch with green vegetables and fruits.
9. Brush your teeth twice a day for oral health.
10. Sit or stand at a comfortable distance from screens.

Don'ts:
1. Do not bite your nails or put pencils in your mouth.
2. Do not share personal towels, combs, or water bottles.
3. Do not cough or sneeze directly onto other people.
4. Do not spit on school corridors, grounds, or walls.
5. Do not buy open or unhygienic food from street sellers.
6. Do not attend school if you have a highly infectious flu.
7. Do not rub your eyes or touch your face with dirty hands.
8. Do not throw food leftovers on desks or floor corners.
9. Do not wear damp socks or dirty uniforms to school.
10. Do not skip breakfast before coming to school.`
  },
  {
    id: 5,
    title: "5. Library Manners",
    content: `Do's:
1. Maintain pin-drop silence inside the reading hall.
2. Handle books gently and turn pages with care.
3. Keep books back in their correct shelves after reading.
4. Return borrowed books before the designated due date.
5. Cooperate politely with the librarian and helpers.
6. Sit quietly in your assigned study chairs or tables.
7. Report any pre-existing damaged pages to the librarian.
8. Take notes using a notebook instead of writing in books.
9. Keep library cards safe and bring them for checkout.
10. Walk in and out of the library room silently.

Don'ts:
1. Do not fold or bend the corners of book pages.
2. Do not write, underline, or highlight text in library books.
3. Do not tear pages, pictures, or maps from any book.
4. Do not bring snack packets or drinks inside the library.
5. Do not run, push chairs, or make noise in the library.
6. Do not hide books or place them in wrong shelves intentionally.
7. Do not borrow library books under someone else's name.
8. Do not use library computers for playing games.
9. Do not crowd the librarian's desk during rush hours.
10. Do not scribble notes or doodles on library tables.`
  },
  {
    id: 6,
    title: "6. Environmental Protection",
    content: `Do's:
1. Switch off fans and lights when leaving classrooms.
2. Turn off water taps tightly after washing hands.
3. Put dry waste and wet waste in correct dustbins.
4. Plant trees and water school garden plants regularly.
5. Use both sides of paper sheets when writing notes.
6. Keep your classroom windows open for natural light.
7. Use reusable cloth bags and lunchboxes if possible.
8. Spread awareness about keeping the school green.
9. Collect and throw stray plastic pieces into trash bins.
10. Appreciate and protect birds and butterflies around.

Don'ts:
1. Do not keep lights or projectors running in empty rooms.
2. Do not waste drinking water or play with water taps.
3. Do not pluck flowers, leaves, or break garden branches.
4. Do not throw plastic wrappers or dry leaves on floor.
5. Do not tear or waste blank pages of your notebooks.
6. Do not kill or harm harmless insects in school gardens.
7. Do not throw plastic bottles or garbage in school drains.
8. Do not use single-use plastic bags or lunch wraps.
9. Do not leave your lunch leftovers open on the table.
10. Do not print documents unless it is strictly necessary.`
  },
  {
    id: 7,
    title: "7. Exam & Study Ethics",
    content: `Do's:
1. Keep your eyes strictly on your own answer sheet.
2. Bring all required pens, pencils, and rulers yourself.
3. Read the exam instructions carefully before writing.
4. Complete your homework and projects by yourself.
5. Raise your hand if you need clarification from teachers.
6. Maintain absolute silence during the entire exam hour.
7. Revise your study lessons regularly every weekend.
8. Submit your answer sheets immediately when time ends.
9. Write your roll number and details clearly on top.
10. Appreciate honest marks and learn from wrong answers.

Don'ts:
1. Do not cheat, copy, or look at classmates' papers.
2. Do not bring paper chits, books, or notes to exam hall.
3. Do not whisper, speak, or signal to friends during tests.
4. Do not borrow stationery items from others during exams.
5. Do not copy assignments or homework from internet sources.
6. Do not hide your report cards or forge parents' signatures.
7. Do not spread rumors about exam questions beforehand.
8. Do not waste exam time in daydreaming or drawing.
9. Do not scribble notes or formulas on desks or palms.
10. Do not panic; maintain self-confidence and stay calm.`
  },
  {
    id: 8,
    title: "8. Campus & Corridor Safety",
    content: `Do's:
1. Walk in a disciplined queue in hallways and corridors.
2. Walk on the left side of staircases to allow others way.
3. Hold the handrails firmly while climbing stairs.
4. Greet teachers and visitors politely when passing them.
5. Keep hallway paths clear of school bags and bottles.
6. Cooperate with school prefects and security guards.
7. Report any wet or slippery floors to staff immediately.
8. Open doors gently to avoid hitting anyone behind them.
9. Help younger students navigate corridors safely.
10. Keep corridor walls clean and appreciate displays.

Don'ts:
1. Do not run, push, or race with friends in hallways.
2. Do not slide down staircase handrails or bannisters.
3. Do not make loud shouting noises near other classrooms.
4. Do not jump down multiple steps of stairs at once.
5. Do not play games like tag or football in corridors.
6. Do not crowd or block stair entrances and exits.
7. Do not pull or push doors open with excessive force.
8. Do not write or scribble on hallway bulletin boards.
9. Do not play with fire extinguishers or safety alarms.
10. Do not throw school bags or trash in common walkways.`
  },
  {
    id: 9,
    title: "9. Respectful Communication",
    content: `Do's:
1. Say 'please', 'thank you', and 'excuse me' daily.
2. Listen to others patiently before sharing your thoughts.
3. Respect teachers, helpers, and school staff always.
4. Help new students feel comfortable and make friends.
5. Appreciate classmates when they win or do good work.
6. Apologize sincerely if you hurt someone by mistake.
7. Respect others' privacy and personal boundaries.
8. Speak kindly about classmates behind their backs.
9. Accept constructive feedback and try to improve.
10. Value differences in backgrounds, cultures, and skills.

Don'ts:
1. Do not call names, mock, or tease your classmates.
2. Do not exclude anyone from games or study groups.
3. Do not talk back rudely or argue with school teachers.
4. Do not spread rumors or gossip about any student.
5. Do not mock someone's language, clothes, or looks.
6. Do not take or use others' belongings without asking.
7. Do not raise your voice or shout in arguments.
8. Do not point fingers or make fun of physical challenges.
9. Do not roll your eyes or show disrespectful gestures.
10. Do not judge classmates based on test marks.`
  },
  {
    id: 10,
    title: "10. Bus & Commute Safety",
    content: `Do's:
1. Board and get off the school bus in an orderly line.
2. Sit down immediately in your seat and stay seated.
3. Speak softly to friends to avoid distracting the driver.
4. Keep your school bag properly under your seat or lap.
5. Listen to the bus driver and helper's instructions.
6. Fasten seatbelts if they are available in the vehicle.
7. Greet the driver and helper politely when boarding.
8. Stand at a safe distance from the road while waiting.
9. Walk straight home or to school after getting off the bus.
10. Report any safety concerns in the bus to your teacher.

Don'ts:
1. Do not push or run to grab seats while boarding the bus.
2. Do not stand, run, or walk in the aisle of a moving bus.
3. Do not put your hands, head, or objects out of windows.
4. Do not make loud shouting noises inside the vehicle.
5. Do not throw any garbage or paper out of bus windows.
6. Do not distract the driver by shouting or running around.
7. Do not touch emergency exit doors or safety controls.
8. Do not block the bus exit doors with bags or bottles.
9. Do not get off the bus before it stops completely.
10. Do not cross the street directly in front of the bus.`
  }
];

const classes = ["class-1", "class-2", "class-3", "class-4", "class-5", "class-6", "class-7", "class-8", "class-9"];

async function seed() {
  try {
    console.log("Starting DB seeding for actionWords & instructions...");
    
    // Clean up existing actionWords documents to avoid duplicates
    console.log("Cleaning up old actionWords lessons...");
    const q1 = query(collection(db, "lessons"), where("category", "==", "actionWords"));
    const snapshot1 = await getDocs(q1);
    console.log(`Found ${snapshot1.size} existing actionWords documents. Deleting...`);
    for (const d of snapshot1.docs) {
      await deleteDoc(doc(db, "lessons", d.id));
    }
    console.log("ActionWords cleanup complete!");

    // Clean up existing instructions documents to avoid duplicates
    console.log("Cleaning up old instructions lessons...");
    const q2 = query(collection(db, "lessons"), where("category", "==", "instructions"));
    const snapshot2 = await getDocs(q2);
    console.log(`Found ${snapshot2.size} existing instructions documents. Deleting...`);
    for (const d of snapshot2.docs) {
      await deleteDoc(doc(db, "lessons", d.id));
    }
    console.log("Instructions cleanup complete!");

    // Now, write exactly 1 actionWords document and 10 instructions documents for each class
    let countActions = 0;
    let countInstructions = 0;
    for (const classId of classes) {
      console.log(`Seeding ${classId} actionWords...`);
      await addDoc(collection(db, "lessons"), {
        classId,
        category: "actionWords",
        id: 1,
        title: "200 Action Words",
        content: allActionWordsContent
      });
      countActions++;

      console.log(`Seeding ${classId} instructions...`);
      for (const set of instructionsSets) {
        await addDoc(collection(db, "lessons"), {
          classId,
          category: "instructions",
          id: set.id,
          title: set.title,
          content: set.content
        });
        countInstructions++;
      }
    }
    console.log(`Successfully seeded ${countActions} actionWords and ${countInstructions} instructions documents to Firestore!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
