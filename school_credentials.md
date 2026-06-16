# School Access Credentials - Excellence Voices

This document lists all school codes, school names, and their corresponding teacher and principal passwords for the **Excellence Voices** portal.

---

## 🔑 Login Credentials Table

| School Code | School Name | Teacher Password | Principal Password |
| :--- | :--- | :--- | :--- |
| **exscl-01** / **exlsch01** | LFG Digi High School | `exllfg01` | `prllfg01` |
| **exscl-02** / **exlsch02** | Sreyas the School | `exlsry02` | `prlsry02` |
| **exscl-03** / **exlsch03** | Vashistha Model school, bollaram | `exlvas03` | `prlvas03` |
| **exscl-04** / **exlsch04** | Jeevan Jyothi School | `exljjv04` | `prljjv04` |
| **exscl-05** / **exlsch05** | Sangamithra School, Dammaiguda | `exlsng05` | `prlsng05` |
| **exscl-06** / **exlsch06** | Sri Vaagdevi School (main branch) | `exlvag06` | `prlvag06` |
| **exscl-07** / **exlsch07** | Glorious School | `exlglo07` | `prlglo07` |
| **exscl-08** / **exlsch08** | Sree Gouthami High School | `exlgou08` | `prlgou08` |
| **exscl-09** / **exlsch09** | KVR High School | `exlkvr09` | `prlkvr09` |
| **exscl-10** / **exlsch10** | Vashistha School, chitkul | `exlvas10` | `prlvas10` |
| **exscl-11** / **exlsch11** | vashistha School,Rampally | `exlvas11` | `prlvas11` |
| **exscl-12** / **exlsch12** | Geethanjali,Isnapur | `exlgee12` | `prlgee12` |
| **exscl-13** / **exlsch13** | Sri Vaagdevi School -2 | `exlvag13` | `prlvag13` |
| **exscl-14** / **exlsch14** | Vashistha School,Indresham | `exlvas14` | `prlvas14` |
| **exscl-15** / **exlsch15** | Vashistha School | `exlvas15` | `prlvas15` |
| **exscl-16** / **exlsch16** | Excellence School 16 | `exlsch16` | `prlsch16` |
| **exscl-17** / **exlsch17** | Excellence School 17 | `exlsch17` | `prlsch17` |
| **exscl-18** / **exlsch18** | Excellence School 18 | `exlsch18` | `prlsch18` |

*Note: You can type school codes either with a hyphen (e.g., `exscl-01`) or as a continuous code matching the user inputs (e.g., `exlsch01`). The portal automatically normalizes the code to identify the school.*

---

## 👩‍🏫 Portal Logins

1. **Teachers Portal**:
   * **Route**: `/teachers` (e.g. `http://localhost:3001/teachers`)
   * **Required Fields**: Teacher Name, School selection dropdown, Subject selection dropdown, Password.
   * **Access**: Unlocks the teacher's lesson planner dashboard and synchronizes teaching progress and time spent to Firestore.

2. **Principals Portal**:
   * **Route**: `/principals` (e.g. `http://localhost:3001/principals`)
   * **Required Fields**: Principal Name, School selection dropdown, Admin Password.
   * **Access**: Displays a live dashboard fetching activity stats and weekly course progress *only* for teachers belonging to the selected school code.
