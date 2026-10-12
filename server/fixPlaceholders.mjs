import { adminDb } from './firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

async function fixPlaceholders() {
  console.log('Fixing placeholder chapters in Firestore...');

  // 1. Update Class 10 Urdu Ch 1 'hammad'
  await adminDb.collection('chapters').doc('1L3CYhyKuEJX6YDEUKQo').update({
    title: 'Hamd (Maulana Zafar Ali Khan)',
    description: 'Sindh Textbook Board Matric Urdu — Hamd by Maulana Zafar Ali Khan: theme, translation, explanation, and central ideas.',
    learningObjectives: [
      'Understand the thematic depth of Hamd and Allah\'s supreme majesty',
      'Analyze the literary style and rhetorical devices of Maulana Zafar Ali Khan',
      'Explain key verses and summarize the moral and spiritual teachings'
    ],
    textbookContent: `Nazm: Hamd (by Maulana Zafar Ali Khan)

Dil jis say laraz jaye woh ik zaat-e-Khuda hai
Har shay pe jo chhayi hai woh ik zaat-e-Khuda hai

Toofaan mein ghiri kashti ko sahil pe lagane
Andheron se ujalay mein safeenay ko bulanay

Jo banda-nawazi hai woh ik zaat-e-Khuda hai
Har dard ka darmaan hai woh ik zaat-e-Khuda hai

Summary & Explanation:
In this celebrated Hamd, Maulana Zafar Ali Khan articulates the profound Islamic principle of Tawheed. He describes how human beings, when overwhelmed by trials and storms of life, find solace and rescue exclusively through the divine mercy and compassion of Almighty Allah.`,
    theoryNotes: `### 1.1 Poet Introduction
Maulana Zafar Ali Khan (1873-1956) was a towering intellectual, poet, journalist, and founding figure of the Pakistan Movement. He edited the influential daily 'Zamindar' and is renowned for his mastery of Urdu diction.

### 1.2 Central Idea
Every atom of the universe attests to the oneness and absolute sovereignty of Allah. True deliverance and solace in adversity come solely from the Almighty.`,
    keyFormulas: 'Themes: Tawheed, Divine Mercy, Spiritual Devotion, Faith',
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log('Updated Class 10 Urdu Hamd successfully!');

  // 2. Update Class 10 Physics Ch 1 (placeholder) to Ch 13 Electrostatics
  await adminDb.collection('chapters').doc('Xn1OwfsArQdCrH0MWi2u').update({
    chapterNumber: 13,
    title: 'Electrostatics',
    description: "Electric charge, Coulomb's law, electric field intensity, electric potential, and capacitors in series and parallel combinations.",
    learningObjectives: [
      "Describe electrostatic induction and properties of electric charges",
      "State Coulomb's Law and solve numerical problems in vacuum and dielectrics",
      "Calculate equivalent capacitance of capacitors connected in series and parallel circuits",
    ],
    textbookContent: `Chapter 13: Electrostatics

1. PRODUCTION OF ELECTRIC CHARGES
Electric charge is a fundamental property of matter. Charges are of two types: positive charge and negative charge.
Like charges repel each other, while unlike charges attract each other.
Electrostatic Induction: The phenomenon of charging an uncharged conductor by bringing a charged object close to it without actual contact.

2. COULOMB'S LAW (Charles Coulomb, 1785)
The electrostatic force between two point charges q1 and q2 is directly proportional to the product of the magnitude of charges and inversely proportional to the square of the distance r between them:
F = k · (q1 · q2) / r²
where k is the electrostatic constant: k = 1 / (4πε₀) = 9.0 × 10⁹ N·m²/C².

3. ELECTRIC FIELD AND ELECTRIC FIELD INTENSITY
The region around an electric charge in which it exerts an electrostatic force on other charges is called its electric field.
Electric Field Intensity (E): Force per unit positive test charge placed at that point:
E = F / q₀ (SI unit: N/C or V/m).

4. CAPACITORS
A device used to store electric charge and electrical energy.
Consists of two parallel conducting plates separated by an insulator (dielectric).
Charge Q ∝ V => Q = C · V
where C is the capacitance (SI unit: Farad, F).
- Capacitors in Series: 1/Ceq = 1/C1 + 1/C2 + 1/C3
- Capacitors in Parallel: Ceq = C1 + C2 + C3`,
    theoryNotes: `### 13.1 Electric Potential (V)
Work done in bringing a unit positive charge from infinity to a point in an electric field:
V = W / q₀ (SI unit: Volt, V = J/C).

### 13.2 Uses of Capacitors
* Camera flash units to release sudden burst of energy.
* Power supply filter circuits to smooth pulsating DC.
* Radio tuning circuits to select broadcast frequencies.`,
    keyFormulas: `* F = k(q1·q2) / r² where k = 9 × 10⁹ N·m²/C²
* E = F / q₀
* V = W / q₀
* Q = C · V
* Series: 1/Ceq = 1/C1 + 1/C2 + ...
* Parallel: Ceq = C1 + C2 + ...`,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log('Updated Class 10 Physics Ch 13 Electrostatics successfully!');

  process.exit(0);
}

fixPlaceholders().catch(err => {
  console.error('Error fixing placeholders:', err);
  process.exit(1);
});
