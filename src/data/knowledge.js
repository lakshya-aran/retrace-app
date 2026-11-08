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
  { v: 'remove', l: 'Took off a jacket, bag or helmet', w: 3 },
  { v: 'handed', l: 'Handed it to someone', w: 3 },
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
  ['journey', 'Journey'], ['details', 'Details'], ['plan', 'Your plan'],
];

export const EXAMPLE = {
  item: 'phone', desc: 'Black Redmi Note, clear cover with a metro card tucked behind it', checks: ['pockets', 'call'],
  now: { kind: 'home', name: 'Home' }, when: '3h', extra: { track: 'android', batt: 'low' },
  stops: [
    { kind: 'cafe', name: 'Chai Point, Sector 18', did: ['used', 'down', 'pay', 'rush'] },
    { kind: 'atm', name: 'SBI ATM', via: 'walk', did: ['pass'] },
    { kind: 'station', name: 'Sector 18 metro', via: 'metro', viaNote: 'Blue line towards Dwarka, around 4:40 pm', did: ['seat'] },
    { kind: 'home', name: 'Home', via: 'auto', viaNote: 'Paid ₹60 by UPI, green auto', isNow: true },
  ],
};
