import { getCheckup } from '@/server/hooks/checkup';
import { ReferencesEntityType } from '@/utils/db.type';

import InterRegular from '@/assets/fonts/Inter-Regular.ttf';
import InterBold from '@/assets/fonts/Inter-Bold.ttf';
import InterItalic from '@/assets/fonts/Inter-Italic.ttf';

import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { TreatmentDtoSchemaType } from '@/server/schema/checkup';
import moment from 'moment';

const styles = StyleSheet.create({
  body: {
    fontFamily: 'InteRegular',
    fontSize: 6,
    paddingHorizontal: 10
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '2 solid #000',
    padding: 4
  },
  footer: {
    display: 'flex',
    flexDirection: 'column'
  },
  fontBold: {
    fontFamily: 'InterBold'
  },
  borderBottom: {
    borderBottom: '1 solid #000'
  },
  clinicInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  patientInfo: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 4,
    paddingTop: 4
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  treatmentItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3
  },
  bulletPoint: {
    fontSize: 10,
    marginRight: 4
  },
  medicineSignaContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  medicine: {
    fontFamily: 'InterBold',
    textTransform: 'uppercase',
    fontSize: 7,
    marginBottom: 1
  },
  signa: {
    fontFamily: 'InterItalic',
    textTransform: 'capitalize',
    fontSize: 5
  }
});

Font.register({
  family: 'InteRegular',
  src: InterRegular
});

Font.register({
  family: 'InterBold',
  src: InterBold
});

Font.register({
  family: 'InterItalic',
  src: InterItalic
});

const TreatmentList = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

const TreatmentItem = ({ medicine, signa }: { medicine?: string; signa: string }) => {
  return (
    <View style={styles.treatmentItemContainer}>
      <View style={styles.bulletPoint}>
        <Text>•</Text>
      </View>
      <View style={styles.medicineSignaContainer}>
        <View style={styles.medicine}>
          <Text>{medicine}</Text>
        </View>
        <View style={styles.signa}>
          <Text>{signa}</Text>
        </View>
      </View>
    </View>
  );
};

const PrescriptionPDF = ({ id, medicinesData }: { id: number; medicinesData: ReferencesEntityType[] }) => {
  const checkupData = getCheckup({ id });
  const treatments = checkupData?.treatments
    ? (JSON.parse(JSON.stringify(checkupData.treatments)) as TreatmentDtoSchemaType[])
    : [];

  return (
    <Document>
      {/* size = 4.25 inc x 5.5 inc -> 306 points x 396 points  */}
      <Page style={styles.body} size={{ width: 306, height: 396 }}>
        {/* header */}
        <View style={styles.header} fixed>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: '2 solid #000',
                alignItems: 'flex-end',
                paddingHorizontal: 3
              }}
            >
              <Text style={[styles.fontBold, { fontSize: 8 }]}>CONFLUENCE</Text>
              <Text style={{ fontSize: 4 }}>HEALTH & WELLNESS PRODUCTS</Text>
            </View>
            <View style={{ paddingHorizontal: 3, paddingVertical: 4 }}>
              <Text style={{ fontSize: 10 }}>Life Extension Medical Clinic</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'flex-end', paddingVertical: 3 }}>
            <Text style={{ fontFamily: 'Times-Bold', color: 'red' }}>CHP-BLC-DR005</Text>
          </View>
          <View style={styles.clinicInfo}>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text>Level 1 Robinson Place Iloilo, De leon Street, Iloilo City</Text>
              <Text>Cotact Nos. (0333) 333-4432 | 09173181142</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text>Clinic Hrs: Mon - Sun</Text>
              <Text>8:30AM - 4:00PM</Text>
            </View>
          </View>
        </View>
        {/* patient info */}
        <View style={styles.patientInfo} fixed>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ width: '80%' }}></View>
            <View
              style={{ alignSelf: 'center', display: 'flex', flexDirection: 'row', width: '20%', paddingBottom: 3 }}
            >
              <Text>Date: </Text>
              <Text style={styles.borderBottom}>{moment(checkupData?.createdAt).format('LL')}</Text>
            </View>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 3 }}>
                <Text>Patient: </Text>
                <Text style={styles.borderBottom}>
                  {checkupData?.patient.firstName}{' '}
                  {checkupData?.patient.middleInitial && checkupData?.patient.middleInitial + '.'}{' '}
                  {checkupData?.patient.lastName}
                </Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text>Address: </Text>
                <Text style={styles.borderBottom}>{checkupData?.patient.address}</Text>
              </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 3 }}>
                <Text>Age: </Text>
                <Text style={styles.borderBottom}>{checkupData?.patient.age}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text>Sex: </Text>
                <Text style={styles.borderBottom}>{checkupData?.patient.gender.name}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* prescription content */}
        <View style={styles.content}>
          <View fixed>
            <Text style={{ fontSize: 38, marginTop: -5 }}>℞</Text>
          </View>
          <View style={{ height: 'auto', marginVertical: 'auto' }}>
            <TreatmentList>
              {treatments &&
                treatments.length > 0 &&
                treatments.map((t, i) => (
                  <TreatmentItem
                    key={i}
                    medicine={
                      !!medicinesData && medicinesData.length > 0
                        ? medicinesData.find(ref => ref.id === t.medicineId)?.name
                        : ''
                    }
                    signa={t.signa}
                  />
                ))}
            </TreatmentList>
          </View>
        </View>
        {/* footer */}
        <View style={[styles.footer, { paddingTop: 15, marginTop: 'auto' }]} fixed>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 4,
              alignItems: 'flex-end'
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'column', width: '65%' }}>
              <Text style={[styles.fontBold, { paddingBottom: 2 }]}>Special Instructions: </Text>
              <Text>( ) low salt, low fat diet</Text>
              <Text>( ) avoid high sugar foods</Text>
              <Text>( ) fiber rich diet (fruits/vegetables)</Text>
              <Text>( ) increase oral fluid intake</Text>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
                <Text>( ) </Text>
                <Text style={styles.borderBottom}>N/A</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '35%' }}>
              <View>
                <Text style={[styles.fontBold, { fontSize: 10, paddingBottom: 2 }]}>
                  {checkupData?.physician.firstName}{' '}
                  {checkupData?.physician.middleInitial && checkupData?.physician.middleInitial + '.'}{' '}
                  {checkupData?.physician.lastName}, MD
                </Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
                <Text>Licence No. </Text>
                <Text style={styles.borderBottom}>74774</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
                <Text>PTR No. </Text>
                <Text style={[styles.borderBottom]}>516238</Text>
              </View>
            </View>
          </View>
          <View>
            <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
              <Text style={styles.fontBold}>Follow up: </Text>
              <Text style={styles.borderBottom}>
                {checkupData?.followUp ? moment(checkupData?.followUp).format('LL') : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PrescriptionPDF;
