import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ShuhadaDetail.css';

// Data from PPTX - 10 people with their images
const shuhadaData = {
  1: {
    id: 1,
    type: 'Mil Shaheed',
    armyNo: '3385001',
    rank: 'L/Nk',
    name: 'Mir Ali Khan',
    unit: '3 LCB',
    ro: 'L/Dir',
    dateOfShahadat: '27 Aug 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'L/Dir',
    image: '/MirAliKhan.jpg',
    circumstances: [
      'On 27 August 2024, militants attacked Bravo Company of the 3 LCB (FF) at Arshad Sangar, Orakzai.',
      'L/Nk Mir Ali Khan heroically countered the assault, disrupting the militants\' advance.',
      'Despite sustaining bullet injuries during the fierce engagement, he fought bravely until he made the ultimate sacrifice.'
    ],
    nokDetails: '-'
  },
  2: {
    id: 2,
    type: 'Mil Shaheed',
    armyNo: '3410042',
    rank: 'Sep',
    name: 'Amir Sohail',
    unit: '3 LCB',
    ro: 'Lakki Marwat',
    dateOfShahadat: '27 Aug 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Arshad Sangar, Orakzai',
    image: '/AmirSohail.jpg',
    circumstances: [
      'On 27 August 2024, militants attacked Bravo Company of 3 LCB (FF) at Arshad Sangar, Orakzai.',
      'Sep Amir Sohail bravely provided covering fire amidst intense militant fire, enabling his comrades to secure defensive positions.',
      'While fighting fearlessly, Sep Amir Sohail got injured and embraced martyrdom.'
    ],
    nokDetails: '-'
  },
  3: {
    id: 3,
    type: 'Mil Shaheed',
    armyNo: '3408250',
    rank: 'Sep',
    name: 'Muhammad Hayat',
    unit: '3 LCB',
    ro: 'Malakand',
    dateOfShahadat: '27 Aug 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Arshad Sangar, Orakzai Agency',
    image: '/MuhammadHayat.jpg',
    circumstances: [
      'On 27 August 2024, militants launched a fierce fire raid using grenades and gunfire on Bravo Company of 3 LCB (FF) at Arshad Sangar, Orakzai Agency.',
      'Sep Muhammad Hayat heroically rushed to save an injured comrade during the attack.',
      'He was fatally wounded by grenade splinters and embraced martyrdom.'
    ],
    nokDetails: '-'
  },
  4: {
    id: 4,
    type: 'Mil Shaheed',
    armyNo: '3411723',
    rank: 'Sep',
    name: 'Mushtaq',
    unit: '3 LCB',
    ro: 'Malakand',
    dateOfShahadat: '25 Sep 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Bazah Village, Kurram',
    image: '/Mushtaq.jpg',
    circumstances: [
      'On 25 September 2024, A Company of 3 LCB (FF) was ambushed by militants in Bazah Village, Kurram.',
      'Outnumbered, the troops courageously repelled the attack.',
      'Sep Mushtaq showed extraordinary bravery, repositioning to neutralize the militants but was fatally engaged by sniper fire, embracing martyrdom.'
    ],
    nokDetails: '-'
  },
  5: {
    id: 5,
    type: 'Mil Shaheed',
    armyNo: '3415544',
    rank: 'Sep',
    name: 'Muhammad Ahmed',
    unit: '3 LCB',
    ro: 'Sheikhupura',
    dateOfShahadat: '25 Sep 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: 'T Bt',
    awards: '',
    year: 2024,
    location: 'Tekri Patey, Kurram',
    image: '/MuhammadAhmad.jpg',
    circumstances: [
      'On 25 September 2024 at 1400 hours, militants ambushed A Company of 3 LCB (FF) while setting up a blocking position in Tekri Patey, Kurram.',
      'Sep Muhammad Ahmed bravely took a forward position to protect his comrades, enabling them to counter the attack.',
      'During the intense firefight, he was engaged by a sniper and embraced martyrdom.'
    ],
    nokDetails: '-'
  },
  6: {
    id: 6,
    type: 'Mil Shaheed',
    armyNo: '3405635',
    rank: 'Sep',
    name: 'Shoib Haider',
    unit: '8 Cdo',
    ro: 'Jhang',
    dateOfShahadat: '15 Dec 24',
    operation: 'Clearance Operation',
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'S Bt',
    year: 2024,
    location: 'Zarpakha Village, Tirah, Khyber Agency',
    image: '/ShoibHaider.jpg',
    circumstances: [
      'On 15 December 2024, 8 Commando Battalion (SSG) was tasked with clearance of Zarpakha Village in Tirah, Khyber Agency.',
      'Sep Shoib Haider put his life at risk to recover his buddy, Sep Muhammad Rehman, who was injured by militant fire.',
      'As he attempted to drag and carry the body to safety, a militant sniper fired and fatally injured Sep Shoib Haider.'
    ],
    nokDetails: '-'
  },
  7: {
    id: 7,
    type: 'Civ Shaheed',
    armyNo: '3293505',
    rank: 'Civ/Dvr',
    name: 'Zarshad',
    unit: '14 Civ GT Coy',
    ro: 'Khyber',
    dateOfShahadat: '12 Nov 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'TS',
    year: 2024,
    location: 'Near Aman Chowk',
    image: '/Zarshad.jpg',
    circumstances: [
      'Civ Driver Zarshad (Shaheed) was performing duties as water bowser driver at Bhuttan Company HQ of ex-15 Sindh Regiment.',
      'On 12 November 2024, while fetching water from Aman Chowk, militants attacked the water bowser.',
      'Civ Driver Zarshad was hit by militant fire and embraced martyrdom.'
    ],
    nokDetails: '-'
  },
  8: {
    id: 8,
    type: 'Mil Shaheed',
    armyNo: '50196',
    rank: 'Maj',
    name: 'Syed Moiz Abbas Shah',
    unit: '7 NLI',
    ro: 'Chakwal',
    dateOfShahadat: '25 Sep 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'SJ',
    year: 2024,
    location: 'Area Sanitization Op (SF-1)',
    image: '/SyedMoizAbbasShah.jpg',
    circumstances: [
      'At 240500 hours in June 2025, an Area Sanitization Operation commenced with Maj Syed Moiz Abbas Shah leading Sanitization Force-1 (SF-1).',
      'During movement, SF-1 received fire from Khawarjis and a comrade was injured.',
      'The officer moved forward to engage the enemy, was hit by a sniper bullet in his right eye, and embraced martyrdom on the spot.'
    ],
    nokDetails: '-'
  },
  9: {
    id: 9,
    type: 'Mil Injury',
    armyNo: '56935',
    rank: 'Maj',
    name: 'Arif Hussain',
    unit: '8 Cdo',
    ro: 'Astore',
    dateOfInjury: '15 Dec 24',
    operation: 'Clearance Operation',
    natureOfInjury: 'Bullet Injuries (right arm splinter)',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Zarpakha Village, Tirah, Khyber Agency',
    image: '/ArifHussain.jpg',
    circumstances: [
      'On 15 December 2024, 8 Commando Battalion (SSG) was tasked with clearance of Zarpakha Village in Tirah, Khyber Agency.',
      'Jabir Company under Maj Arif Hussain was tasked to occupy Tori Jungle Top overlooking Zarpakha Village.',
      'During intense fire exchange and casualty recovery, Maj Arif Hussain received a bullet splinter injury on his right arm and became incapacitated.'
    ],
    nokDetails: '-'
  },
  10: {
    id: 10,
    type: 'Mil Injury',
    armyNo: '61033',
    rank: 'Capt',
    name: 'M. Rehan Yaseen',
    unit: '8 Cdo',
    ro: 'Lahore',
    dateOfInjury: '15 Dec 24',
    operation: 'Clearance Operation',
    natureOfInjury: 'Bullet Injuries (left leg)',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Zarpakha Village, Tirah, Khyber Agency',
    image: '/MRehanYaseen.jpg',
    circumstances: [
      'On 15 December 2024, 8 Commando Battalion (SSG) was tasked with clearance of Zarpakha Village in Tirah, Khyber Agency.',
      'During the approach phase, a militant sniper inflicted casualties including Sep Muhammad Rehman (Shaheed) and Sep Shoaib Haider (Shaheed).',
      'While covering the extraction of Sep Muhammad Rehman\'s body, Capt M. Rehan Yaseen sustained two gunshot wounds to his left leg.'
    ],
    nokDetails: '-'
  },
  11: {
    id: 11,
    type: 'Mil Ghazi',
    armyNo: '3456789',
    rank: 'Lt Col',
    name: 'Ali Raza',
    unit: '11 Corps',
    ro: 'Rawalpindi',
    operation: 'Counter Terrorism Operations',
    natureOfInjury: '',
    previousAchievements: '',
    awards: 'Hilal-i-Jur\'at (HJ)',
    year: 2023,
    location: 'Khyber Pakhtunkhwa',
    image: '/image2.jpg',
    circumstances: [
      'Served with distinction in multiple counter terrorism operations under 11 Corps area of responsibility.',
      'Demonstrated exceptional leadership and composure under fire while commanding troops in high-risk environments.',
      'Recognized for outstanding gallantry and devotion to duty in the face of the enemy.'
    ],
    nokDetails: '-'
  }
};

const ShuhadaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const shuhada = shuhadaData[parseInt(id)];

  if (!shuhada) {
    return (
      <div className="shuhada-detail-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          Back
        </button>
        <div className="not-found">Shuhada record not found</div>
      </div>
    );
  }

  return (
    <div className="shuhada-detail-container screen-fade">
      <button className="btn-back" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="detail-content">
        <div className="detail-body">
          {/* Left Panel */}
          <div className="left-panel">
            <div className="photo-section">
              <div className="photo-container">
                {shuhada.image ? (
                  <img 
                    src={shuhada.image} 
                    alt={shuhada.name}
                    className="photo-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="photo-placeholder" style={{ display: shuhada.image ? 'none' : 'flex' }}>
                  <div className="photo-rank">{shuhada.rank}</div>
                  <div className="photo-name">{shuhada.name}</div>
                </div>
                {(shuhada.type && shuhada.type.includes('Shaheed')) && (
                  <div className="shaheed-tag">
                    <span>Shaheed</span>
                  </div>
                )}
                {(shuhada.type && shuhada.type.includes('Injury')) && (
                  <div className="injury-tag">
                    <span>Injured</span>
                  </div>
                )}
                {(shuhada.type && shuhada.type.includes('Ghazi')) && (
                  <div className="ghazi-tag">
                    <span>Ghazi</span>
                  </div>
                )}
              </div>
            </div>

            <div className="circumstances-box">
              <h3 className="circumstances-title">
                {shuhada.type && shuhada.type.includes('Shaheed') ? 'Brief Details of Circumstances of Shahadat' :
                 shuhada.type && shuhada.type.includes('Injury') ? 'Brief Details of Circumstances of Injury' :
                 shuhada.type && shuhada.type.includes('Ghazi') ? 'Brief Details of Service' :
                 'Brief Details'}
              </h3>
              <div className="circumstances-content">
                {shuhada.circumstances.map((circumstance, index) => (
                  <p key={index} className="circumstance-text">{circumstance}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <div className="table-wrapper">
              <table className="detail-table">
                <tbody>
                  <tr className="table-row-blue">
                    <td className="table-label">No</td>
                    <td className="table-value">Army No: {shuhada.armyNo}</td>
                  </tr>
                  <tr className="table-row-grey">
                    <td className="table-label">Rank</td>
                    <td className="table-value">{shuhada.rank}</td>
                  </tr>
                  <tr className="table-row-blue">
                    <td className="table-label">Name</td>
                    <td className="table-value">{shuhada.name}</td>
                  </tr>
                  <tr className="table-row-grey">
                    <td className="table-label">Unit</td>
                    <td className="table-value">{shuhada.unit}</td>
                  </tr>
                  <tr className="table-row-blue">
                    <td className="table-label">R/O</td>
                    <td className="table-value">{shuhada.ro}</td>
                  </tr>
                  {shuhada.type && shuhada.type.includes('Shaheed') && (
                    <>
                      <tr className="table-row-grey">
                        <td className="table-label">Date of Shahadat</td>
                        <td className="table-value">{shuhada.dateOfShahadat}</td>
                      </tr>
                      <tr className="table-row-blue">
                        <td className="table-label">OP</td>
                        <td className="table-value">{shuhada.operation}</td>
                      </tr>
                      <tr className="table-row-grey">
                        <td className="table-label">Nature of Shahadat</td>
                        <td className="table-value">{shuhada.natureOfShahadat}</td>
                      </tr>
                    </>
                  )}
                  {shuhada.type && shuhada.type.includes('Injury') && (
                    <>
                      <tr className="table-row-grey">
                        <td className="table-label">Date of Injury</td>
                        <td className="table-value">{shuhada.dateOfInjury}</td>
                      </tr>
                      <tr className="table-row-blue">
                        <td className="table-label">OP</td>
                        <td className="table-value">{shuhada.operation}</td>
                      </tr>
                      <tr className="table-row-grey">
                        <td className="table-label">Nature of Injury</td>
                        <td className="table-value">{shuhada.natureOfInjury}</td>
                      </tr>
                    </>
                  )}
                  {shuhada.type && shuhada.type.includes('Ghazi') && (
                    <tr className="table-row-grey">
                      <td className="table-label">OP</td>
                      <td className="table-value">{shuhada.operation}</td>
                    </tr>
                  )}
                  <tr className="table-row-blue">
                    <td className="table-label">Previous Achievements</td>
                    <td className="table-value">{shuhada.previousAchievements || '-'}</td>
                  </tr>
                  <tr className="table-row-grey">
                    <td className="table-label">Awards</td>
                    <td className="table-value">{shuhada.awards}</td>
                  </tr>
                  <tr className="table-row-blue">
                    <td className="table-label">NOK Details</td>
                    <td className="table-value">{shuhada.nokDetails}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {shuhada.type && shuhada.type.includes('Shaheed') && (
              <div className="tribute-message">
                <p className="tribute-text">
                  "We honor the sacrifice of our Shaheed. Their valor and dedication to the nation will forever be remembered. 
                  May Allah grant them the highest place in Jannah. Their legacy will continue to inspire us all."
                </p>
              </div>
            )}
            {shuhada.type && shuhada.type.includes('Injury') && (
              <div className="tribute-message">
                <p className="tribute-text">
                  "We honor the service and sacrifice of our injured personnel. Their courage and dedication to the nation will forever be remembered. 
                  May they recover fully and continue to serve with honor."
                </p>
              </div>
            )}
            {shuhada.type && shuhada.type.includes('Ghazi') && (
              <div className="tribute-message">
                <p className="tribute-text">
                  "We honor the exceptional service of our Ghazi. Their valor and dedication to the nation will forever be remembered. 
                  Their achievements continue to inspire us all."
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShuhadaDetail;
