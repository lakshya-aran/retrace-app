// All the "domain knowledge" lives here: what can be asked, the answer options,
// how much each answer raises the chance the item is at a place, and what to do there.
// Extend the app mostly by editing this file.

export const COMMON_CHECKS = [
  { v: 'pockets', l: 'Every pocket (jacket, jeans, back pocket)' },
  { v: 'bag', l: 'Every bag compartment, including small inner zips' },
  { v: 'usual', l: 'The place you usually keep it' },
  { v: 'vehicle', l: 'Your car or scooter: seats, gaps, boot, dicky' },
];

export const ITEMS = {
  phone: { l: 'Phone', checks: [{ v: 'call', l: 'Called it from another phone' }, { v: 'find', l: 'Checked Find My Device / Find My' }] },
  wallet: { l: 'Wallet / purse', checks: [{ v: 'bankapp', l: 'Checked bank app for any new transactions' }] },
  keys: { l: 'Keys', checks: [{ v: 'lock', l: 'Still in the door lock or ignition?' }, { v: 'hook', l: 'Key hook, bowl or table near the door' }] },
  bag: { l: 'Bag / backpack', checks: [{ v: 'seat', l: 'Under or behind the seat you used' }] },
  laptop: { l: 'Laptop / tablet', checks: [{ v: 'desk', l: 'Desk, meeting room or charging point' }] },
  earbuds: { l: 'Earbuds / headphones', checks: [{ v: 'bt', l: "Phone's Bluetooth list: does it still connect?" }, { v: 'case', l: 'Inside the charging case' }] },
  docs: { l: 'ID / documents', checks: [{ v: 'files', l: 'Folders, files and envelopes you carried' }] },
  bottle: { l: 'Bottle / mug', checks: [{ v: 'cup', l: 'Desk, cup holder, bag side pocket' }] },
  jewel: { l: 'Watch / jewellery', checks: [{ v: 'wash', l: 'Near washbasins or where you washed hands' }] },
  wear: { l: 'Umbrella / jacket', checks: [{ v: 'chair', l: 'Back of the chair you sat on' }] },
  other: { l: 'Something else', checks: [] },
};

export const PLACES = [
  { v: 'home', l: 'Home' }, { v: 'work', l: 'Office / class' }, { v: 'cafe', l: 'Café / restaurant' },
  { v: 'shop', l: 'Shop / market' }, { v: 'mall', l: 'Mall' }, { v: 'friend', l: "Someone's place" },
  { v: 'station', l: 'Bus stop / station' }, { v: 'atm', l: 'ATM / bank' }, { v: 'gym', l: 'Gym' },
  { v: 'hospital', l: 'Hospital / clinic' }, { v: 'park', l: 'Park / street' }, { v: 'event', l: 'Cinema / event' },
  { v: 'other', l: 'Somewhere else' },
];

export const PLACE_ADVICE = {
  home: 'Check the spot where you drop things when you walk in, the sofa gaps, the bed and the bathroom shelf.',
  work: 'Ask reception or the security desk, then check your desk, meeting rooms and the pantry.',
  cafe: 'Call or go back. Ask at the counter and check under and around the table you used.',
  shop: 'Ask at the billing counter. Shops usually keep found items behind the till.',
  mall: 'Go to the mall help desk / customer service. They log lost items and can check CCTV.',
  friend: 'Message them now and ask them to check where you sat.',
  station: 'Ask the station master, ticket counter or security post.',
  atm: 'Ask the guard. If it is inside a bank, ask at the help desk.',
  gym: 'Check the locker, bench and changing room; ask the front desk.',
  hospital: 'Ask at reception and the waiting area; hospitals keep a lost & found.',
  park: 'Walk back the same way. Ask guards, vendors and nearby shopkeepers.',
  event: 'Contact the venue or cinema. Staff collect items after each show.',
  other: 'Go back or call the place. Ask whoever is in charge if anything was handed in.',
  gap: 'Check your payment SMS, UPI history and Google Maps Timeline to fill in this gap.',
};

// w = how likely things get left behind on this kind of leg
export const VEH = {
  walk: { l: 'Walked', short: 'The walk', w: 1, veh: false, advice: 'Walk the same route back slowly. Look where you paused, crossed or checked your phone.' },
  own: { l: 'My car / bike / scooter', short: 'Your own vehicle', w: 3, veh: true, advice: 'Search the car or scooter properly: under seats, side gaps, boot or dicky.' },
  cab: { l: 'Cab (Uber, Ola, Rapido…)', short: 'The cab', w: 4, veh: true, note: true, advice: 'Open the ride in your app history → Help → "I lost an item". This connects you to the driver.' },
  auto: { l: 'Auto-rickshaw', short: 'The auto-rickshaw', w: 4, veh: true, note: true, advice: "If you paid by UPI, the driver's name or number may show in the transaction. Ask at the auto stand where you got it." },
  bus: { l: 'Bus', short: 'The bus', w: 3, veh: true, note: true, advice: 'Call the bus depot with the route number and time. Items left on buses go to the depot.' },
  metro: { l: 'Metro / train', short: 'The metro / train', w: 3, veh: true, note: true, advice: 'Go to the station control room or customer care. For trains in India, call 139 or use RailMadad.' },
  drop: { l: 'Someone dropped me', short: 'The ride you were given', w: 3, veh: true, advice: 'Ask the person to check their car or bike right away.' },
};

// w = how much this action raises the chance the item was left at that stop
export const DID = [
  { v: 'used', l: 'Took it out or used it', w: 3 },
  { v: 'down', l: 'Put it down on a table or counter', w: 4 },
  { v: 'seat', l: 'Sat down (seat, bench, sofa)', w: 2 },
  { v: 'pay', l: 'Paid for something', w: 2 },
  { v: 'eat', l: 'Ate or drank something', w: 2 },
  { v: 'wash', l: 'Used the washroom', w: 2 },
  { v: 'remove', l: 'Took off a jacket, bag, helmet, watch or ring', w: 3 },
  { v: 'handed', l: 'Handed it to someone', w: 3 },
  { v: 'charge', l: 'Charged something or plugged it in', w: 3 },
  { v: 'changing', l: 'Changed clothes or tried something on', w: 3 },
  { v: 'hands', l: 'My hands were full', w: 2 },
  { v: 'call', l: 'Was on a call or texting', w: 2 },
  { v: 'shopping', l: 'Picked up shopping bags or a parcel', w: 2 },
  { v: 'rush', l: 'It was crowded or I was in a rush', w: 2 },
  { v: 'bagged', l: 'Put it in my bag or pocket', w: -1 },
  { v: 'pass', l: 'Just passed through', w: 0 },
  { v: 'unsure', l: "I'm not sure", w: 1 },
];
export const DIDW = Object.fromEntries(DID.map((d) => [d.v, d.w]));
export const DIDL = Object.fromEntries(DID.map((d) => [d.v, d.l]));

export const WHEN = [
  { v: '30m', l: 'Less than 30 minutes ago' }, { v: '1h', l: '30 to 60 minutes ago' },
  { v: '3h', l: '1 to 3 hours ago' }, { v: '6h', l: '3 to 6 hours ago' },
  { v: 'day', l: 'Earlier today' }, { v: 'old', l: 'Yesterday or before' },
  { v: 'unsure', l: "I honestly can't remember" },
];
export const WHENL = Object.fromEntries(WHEN.map((w) => [w.v, w.l]));

/* ---------- Human factors: how people actually lose things ---------- */

// Habit decides where things go when we're not paying attention
export const CARRY = [
  { v: 'pocket', l: 'Trouser pocket' }, { v: 'jacket', l: 'Jacket or coat pocket' },
  { v: 'hand', l: 'In my hand' }, { v: 'bag', l: 'In a bag or backpack' },
  { v: 'wear', l: "I wear it (watch, ring, glasses)" }, { v: 'varies', l: 'It varies' },
];
export const CARRYL = Object.fromEntries(CARRY.map((c) => [c.v, c.l]));

// People often "remember" having something just because they usually do
export const SURE = [
  { v: 'saw', l: 'I saw it or held it' },
  { v: 'used', l: 'I used it (a call, a payment, a photo)' },
  { v: 'assumed', l: "I think so, but I'm assuming" },
];

// Asked after every stop: narrows the window when it went missing
export const STILL = [
  { v: 'yes', l: 'Yes, I remember having it after I left' },
  { v: 'think', l: 'I think so, but I am not sure' },
  { v: 'gone', l: 'No, I noticed it missing here' },
  { v: 'unknown', l: "I don't know" },
];

// Follow-ups asked when a particular "what happened" answer is ticked at a stop.
// w adjusts the score for that stop; advice replaces the generic advice for the place.
export const FOLLOWUPS = {
  used: { title: (p) => `After using it at ${p}, where did it go?`, hint: 'Picture your hand right after. Did it go back where it lives?', options: [
    { v: 'sure', l: 'Back in my pocket or bag, I am sure', w: -2 },
    { v: 'think', l: 'Back in my pocket or bag, I think', w: 0 },
    { v: 'down', l: 'I put it down next to me', w: 3, advice: "Check every surface within arm's reach of where you stood or sat." },
    { v: 'blank', l: "I can't picture it", w: 1 }] },
  down: { title: (p) => `Where exactly did you put it down at ${p}?`, hint: 'Close your eyes and picture the surface.', options: [
    { v: 'table', l: 'On a table', w: 1, advice: 'Ask whether the table was cleared, and check under it.' },
    { v: 'counter', l: 'On a counter or billing desk', w: 2, advice: 'Ask the cashier. Counters are where most items get left.' },
    { v: 'seat', l: 'On the seat next to me', w: 2, advice: 'Check down the sides and back of that seat.' },
    { v: 'floor', l: 'On the floor or under the seat', w: 2, advice: 'Look under the seat and ask cleaning staff.' },
    { v: 'shelf', l: 'On a shelf, ledge or windowsill', w: 2, advice: 'Check shelves at hand height near where you stood.' },
    { v: 'blank', l: "I can't picture it", w: 0 }] },
  pay: { title: (p) => `How did you pay at ${p}?`, hint: 'Your payment record gives an exact time and place.', options: [
    { v: 'upi', l: 'Phone (UPI, app or tap)' }, { v: 'card', l: 'Card from my wallet' },
    { v: 'cash', l: 'Cash' }, { v: 'other', l: 'Someone else paid' }] },
  eat: { title: () => 'Was a tray, plate or packaging cleared away?', hint: 'Small things get swept away with trays and napkins.', options: [
    { v: 'me', l: 'Yes, I cleared it myself', w: 2, advice: 'Ask staff to check the tray return and the bins.' },
    { v: 'staff', l: 'Yes, staff cleared it', w: 2, advice: 'Ask the staff who cleared your table, and check the bins.' },
    { v: 'no', l: 'No', w: 0 }] },
  wash: { title: () => 'In the washroom, did you put anything down or hang anything up?', options: [
    { v: 'shelf', l: 'Put things on a shelf or by the basin', w: 3, advice: 'Ask housekeeping. Basins and shelves are a classic spot.' },
    { v: 'hook', l: 'Hung a bag or jacket on a hook', w: 3, advice: 'Check the hook on the back of the washroom door.' },
    { v: 'no', l: 'No', w: 0 }, { v: 'blank', l: "Can't remember", w: 1 }] },
  remove: { title: (p) => `Where did you put what you took off at ${p}?`, options: [
    { v: 'chair', l: 'Over a chair back', w: 2, advice: 'Check the chair you used, and ask for the lost & found.' },
    { v: 'hook', l: 'On a hook or hanger', w: 2, advice: 'Check the hooks and hangers near where you were.' },
    { v: 'seat', l: 'On the seat or next to me', w: 2, advice: 'Check the seat and the floor around it.' },
    { v: 'locker', l: 'In a locker or cloakroom', w: 2, advice: 'Check the locker and ask the cloakroom attendant.' },
    { v: 'blank', l: "Can't remember", w: 1 }] },
  handed: { title: () => 'Did you definitely get it back?', options: [
    { v: 'yes', l: 'Yes, definitely', w: -2 },
    { v: 'unsure', l: 'Not sure', w: 3 },
    { v: 'no', l: 'No, they may still have it', w: 5 }] },
  charge: { title: () => 'Did you unplug everything when you left?', hint: 'Chargers and devices on charge are easy to walk away from.', options: [
    { v: 'yes', l: 'Yes', w: -1 },
    { v: 'no', l: 'No, or not sure', w: 4, advice: 'Ask about the charging point you used. Staff often keep things left plugged in.' }] },
  changing: { title: () => 'Did you check where you changed before leaving?', options: [
    { v: 'yes', l: 'Yes', w: -1 },
    { v: 'no', l: 'No', w: 3, advice: 'Ask staff to check the changing room and the clothes you tried on.' }] },
  shopping: { title: () => 'Have you completely emptied those shopping bags or parcels?', hint: 'Things often drop into a shopping bag at the counter.', options: [
    { v: 'yes', l: 'Yes, every one', w: 0 },
    { v: 'no', l: 'Not yet', w: 0 }] },
};

// State of mind: the moment feels blank because attention was elsewhere
export const MIND = [
  { v: 'rush', l: 'Rushed or running late' }, { v: 'call', l: 'On a call or texting' },
  { v: 'tired', l: 'Tired or sleepy' }, { v: 'stress', l: 'Stressed or upset' },
  { v: 'unwell', l: 'Unwell' }, { v: 'drink', l: 'Had been drinking' },
  { v: 'kids', l: 'Looking after kids' }, { v: 'hands', l: 'Carrying a lot of things' },
  { v: 'calm', l: 'Calm, a normal day' },
];
export const DISTRACTED = ['rush', 'call', 'tired', 'stress', 'unwell', 'drink', 'kids', 'hands'];

// Broken routines are where habits fail
export const ROUTINE = [
  { v: 'bag', l: 'I used a different bag' }, { v: 'clothes', l: 'Different clothes or jacket' },
  { v: 'route', l: 'A different route or vehicle' }, { v: 'newplace', l: "Went somewhere I don't usually go" },
  { v: 'safe', l: "I put it somewhere 'safe' on purpose" }, { v: 'carried', l: 'Someone else carried my things' },
  { v: 'none', l: 'Nothing was different' },
];

export const OTHERS = [
  { v: 'family', l: 'Family at home' }, { v: 'kids', l: 'Kids' },
  { v: 'friend', l: 'A friend or partner who was with me' }, { v: 'colleagues', l: 'Colleagues or classmates' },
  { v: 'pet', l: 'A pet' }, { v: 'none', l: 'Nobody' },
];

export const ALSO_MISSING = [
  { v: 'phone', l: 'Phone' }, { v: 'wallet', l: 'Wallet / purse' }, { v: 'keys', l: 'Keys' },
  { v: 'bag', l: 'Bag' }, { v: 'other', l: 'Something else' }, { v: 'none', l: 'Nothing else' },
];

// Spots people miss when searching at home
export const HOME_SPOTS = {
  common: [
    'Pockets of the clothes you wore today and yesterday',
    'Inside shopping bags, parcels and boxes you brought in',
    'Laundry basket and washing machine',
    'Between and under sofa and bed cushions',
    'Kitchen counter, and inside the fridge (it really happens)',
    'Bathroom shelf',
    'The dustbin, in case it went out with packaging',
    'Your car or under the scooter seat',
  ],
  phone: ['Under pillows and blankets', "Next to a charger you don't usually use"],
  keys: ['Still in the door lock, inside or outside', 'In the bag you carried yesterday'],
  wallet: ['In the bag or jacket from your last trip out'],
  earbuds: ['Jeans pockets in the laundry', 'Inside the bed covers'],
  jewel: ['Next to the washbasin and soap dish', 'Bedside table, and inside the bed'],
};

// Follow-up questions that only make sense for a particular item
export const ITEM_QS = {
  phone: [
    { id: 'track', type: 'choice', title: 'Is location tracking switched on for this phone?', hint: 'This decides whether you can see it on a map right now.',
      options: [{ v: 'android', l: 'Yes, Android (Find My Device)' }, { v: 'iphone', l: 'Yes, iPhone (Find My)' }, { v: 'no', l: 'No / turned off' }, { v: 'unsure', l: 'Not sure' }] },
    { id: 'batt', type: 'choice', title: 'How much battery did it have?', hint: 'A phone that is still on can ring and show its location.',
      options: [{ v: 'ok', l: 'Plenty' }, { v: 'low', l: 'Low' }, { v: 'dead', l: 'Probably dead or switched off' }, { v: 'unsure', l: 'No idea' }] },
  ],
  wallet: [{ id: 'contents', type: 'multi', title: 'What was inside it?', hint: 'Tick everything. Some of these need blocking quickly.',
    options: [{ v: 'cards', l: 'Debit / credit cards' }, { v: 'cash', l: 'Cash' }, { v: 'aadhaar', l: 'Aadhaar card' }, { v: 'licence', l: 'Driving licence' }, { v: 'transit', l: 'Metro / transit card' }, { v: 'pan', l: 'PAN card' }] }],
  bag: [{ id: 'contents', type: 'multi', title: 'What was inside the bag?', hint: 'This changes what you need to secure first.',
    options: [{ v: 'laptop', l: 'Laptop / tablet' }, { v: 'cards', l: 'Wallet or cards' }, { v: 'aadhaar', l: 'ID documents' }, { v: 'keys', l: 'Keys' }, { v: 'none', l: 'Nothing critical' }] }],
  laptop: [{ id: 'track', type: 'choice', title: 'Is "Find my device" on for it?',
    options: [{ v: 'mac', l: 'Yes, Mac / iPad (Find My)' }, { v: 'win', l: 'Yes, Windows (Find my device)' }, { v: 'no', l: 'No' }, { v: 'unsure', l: 'Not sure' }] }],
  earbuds: [{ id: 'kind', type: 'choice', title: 'Which kind of earbuds?', hint: 'Some brands can be located from your phone.',
    options: [{ v: 'airpods', l: 'AirPods / Beats' }, { v: 'galaxy', l: 'Samsung Galaxy Buds' }, { v: 'pixel', l: 'Pixel Buds' }, { v: 'other', l: 'Another brand' }] }],
  keys: [{ id: 'tag', type: 'choice', title: 'Do the keys carry your name or address?', hint: 'If yes, someone could find your door.',
    options: [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }, { v: 'vehicle', l: 'Only a vehicle key' }] }],
  docs: [{ id: 'which', type: 'multi', title: 'Which documents?', hint: 'Most duplicates need a police report or lost report number.',
    options: [{ v: 'aadhaar', l: 'Aadhaar' }, { v: 'pan', l: 'PAN' }, { v: 'licence', l: 'Driving licence' }, { v: 'passport', l: 'Passport' }, { v: 'idcard', l: 'College / office ID' }, { v: 'certs', l: 'Certificates / marksheets' }] }],
};

export const PHASES = [
  ['item', 'What'], ['checks', 'Quick checks'], ['last', 'Last seen'],
  ['journey', 'Journey'], ['you', 'About you'], ['details', 'Details'], ['plan', 'Your plan'],
];

export const EXAMPLE = {
  item: 'phone', desc: 'Black Redmi Note, clear cover with a metro card tucked behind it', carry: 'pocket', checks: ['pockets', 'call'],
  now: { kind: 'home', name: 'Home' }, when: '3h', sure: 'used', extra: { track: 'android', batt: 'low' },
  mind: ['rush', 'call'], routine: ['bag'], others: ['none'], alsoMissing: ['none'],
  stops: [
    { kind: 'cafe', name: 'Chai Point, Sector 18', did: ['used', 'pay', 'call', 'rush'], f: { used: 'blank', pay: 'upi' }, still: 'think' },
    { kind: 'atm', name: 'SBI ATM', via: 'walk', did: ['pass'], f: {}, still: 'unknown' },
    { kind: 'station', name: 'Sector 18 metro', via: 'metro', viaNote: 'Blue line towards Dwarka, around 4:40 pm', did: ['seat', 'hands'], f: {}, still: 'unknown' },
    { kind: 'home', name: 'Home', via: 'auto', viaNote: 'Green auto, paid ₹60 cash', isNow: true, f: {} },
  ],
};
