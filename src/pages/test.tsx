// import { requireAuth } from "@/common/requireAuth";
// import {
//   deleteEntity,
//   getEntities,
//   postEntity,
//   putEntity,
// } from "@/server/hooks/entity";
// import {
//   deletePatient,
//   getPatient,
//   getPatients,
//   getPhysicalCheckup,
//   getPhysicalCheckups,
//   getVitalSignsToday,
//   getVitalSignsByPhysicianIdToday,
//   postPatient,
//   postPhysicalCheckup,
//   postVitalSign,
//   putPatient,
// } from "@/server/hooks/patient";
// import {
//   getReferences,
//   postReference,
//   putReference,
//   deleteReference,
// } from "@/server/hooks/reference";
import { checkDate, checkDateRange } from '@/utils/helper';
import { usePhysicalCheckupFormStore } from '@/utils/patient.store';
// import AddUserWizard from "@/views/AddUserDialogWizard";
import AddPhysicalCheckupDialog from '@/views/pages/patient/AddPhysicalCheckupDialog';
import PatientForm from '@/views/pages/patient/PatientForm';
import PhysicalCheckupDialog from '@/views/pages/patient/PhysicalCheckupDialog';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import moment from 'moment';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { ChangeEvent, MouseEventHandler, forwardRef, useEffect, useState } from 'react';
import { DateRange, DateRangePicker } from '@mui/lab';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import CustomInput from '@/views/forms/form-elements/pickers/PickersCustomInput';
import { useTheme } from '@mui/material/styles';

import PickersBasic from '@/views/forms/form-elements/pickers/PickersBasic';
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PickersRange from '@/views/forms/form-elements/pickers/PickersRange';
import PrescriptionPDF from '@/views/apps/checkup/PrescriptionPDF';

// export const getServerSideProps = requireAuth(async () => {
//   return { props: {} };
// });

const Test: NextPage = () => {
  const [age, setAge] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<{ date: Date | null }>({
    defaultValues: {
      date: null
    },
    mode: 'onChange'
    // resolver: zodResolver()
  });

  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end';

  // const handleChange = (event: SelectChangeEvent) => {
  //   console.dir(event);
  //   setAge(event.target.value as string);
  // };

  // const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
  //   console.dir(event);
  // };

  // const {
  //   mutateAsync: postPatientMutateAsync,
  //   isLoading: postPatientIsLoading,
  // } = postPatient();
  // const { mutateAsync: putPatientMutateAsync, isLoading: putPatientIsLoading } =
  //   putPatient();
  // const {
  //   mutateAsync: deletePatientMutateAsync,
  //   isLoading: deletePatientIsLoading,
  // } = deletePatient();

  // // const { data } = useSession();

  // const { data: patientsData, isLoading: patientsDataIsLoading } =
  //   getPatients();
  // const { data: patientData, isLoading: patientDataIsLoading } = getPatient({
  //   id: "c45e009a-8c59-4006-ba05-88d393fbca50",
  // });

  // const { mutateAsync: postReferenceMutateAsync } = postReference({
  //   entities: [1, 2, 3],
  // });
  // const { mutateAsync: putReferenceMutateAsync } = putReference({
  //   entities: [1, 2, 3],
  // });
  // const { mutateAsync: deleteReferenceMutateAsync } = deleteReference({
  //   entities: [1, 2, 3],
  // });
  // const { data: referencesData, status: referencesDataStatus } = getReferences({
  //   entities: [1, 2, 3],
  // });

  // const { data: entitiesData, status } = getEntities();
  // const { mutateAsync: postEntityMutateAsync } = postEntity();
  // const { mutateAsync: putEntityMutateAsync } = putEntity();
  // const { mutateAsync: deleteEntityMutateAsync } = deleteEntity();

  // const { mutate: postVitalSignMutate } = postVitalSign();
  // const { data: vitalSignsData } = getVitalSignsToday();
  // const { data: vitalSignsDataByPhysicianId } = getVitalSignsByPhysicianIdToday({
  //   physicianId: 12
  // });

  // const { showDialog, onAdd } = usePhysicalCheckupFormStore(state => state);

  // const log1 = () => console.log(vitalSignsData);
  // const log2 = () => console.log(vitalSignsDataByPhysicianId);

  // const { mutate: physicalCheckupMutate } = postPhysicalCheckup();
  // const { data: PhysicalCheckupsData } = getPhysicalCheckups({
  //   patientId: "7f63d842-bfc7-465d-81f4-65f2dd7b565b",
  // });
  // const { data: PhysicalCheckupData } = getPhysicalCheckup({
  //   id: "6e505243-15f4-4c4a-984f-09e3a7e91b27",
  // });

  // const add = async () => {
  //   const result = await postPatientMutateAsync({
  //     firstName: "Kiko",
  //     lastName: "Canono",
  //     middleInitial: "S",
  //     address: "Panacan Davao City",
  //     dateOfBirth: new Date("01-30-1999"),
  //     civilStatusId: 10,
  //     age: 10,
  //     occupationId: 1,
  //     genderId: 2,
  //     contactNumber: "09123456789",
  //     familyHistory: {
  //       diseases: [1, 2, 3],
  //       others: "lorem ipsum dolor",
  //     },
  //     personalHistory: {
  //       smoking: 10,
  //       alcohol: 15,
  //       currentHealthCondition: "Healthy",
  //       medications: [
  //         {
  //           brandName: "Paracetamol",
  //           dosage: "100 ml",
  //           generic: "generic",
  //         },
  //         {
  //           brandName: "Biogesic",
  //           dosage: "15 ml",
  //           generic: "generic",
  //         },
  //       ],
  //     },
  //     pastMedicalHistory: {
  //       hospitalized: "N/A",
  //       injuries: "N/A",
  //       surgeries: "N/A",
  //       allergies: "N/A",
  //       measles: "N/A",
  //       chickenPox: "N/A",
  //       others: "N/A",
  //     },
  //     obGyne: {
  //       menstrualCycle: new Date("01-24-1999"),
  //       days: 15,
  //       p: 1,
  //       g: 1,
  //     },
  //   });

  //   console.log(result);
  // };
  // const update = async () => {
  //   const result = await putPatientMutateAsync({
  //     id: "20c4f0ed-fac4-4730-a736-b37c453b0196",
  //     firstName: "Justine updatedx",
  //     lastName: "Barber updatedx",
  //     middleInitial: "S",
  //     address: "Km 11 Sasa, Bayview",
  //     dateOfBirth: new Date("01-24-2001"),
  //     civilStatusId: 4,
  //     age: 10,
  //     occupationId: 2,
  //     genderId: 2,
  //     contactNumber: "09123456789",
  //     familyHistory: {
  //       diseases: [1, 2, 3],
  //       others: "lorem ipsum dolor",
  //     },
  //     personalHistory: {
  //       smoking: 10,
  //       alcohol: 15,
  //       currentHealthCondition: "Healthy",
  //       medications: [
  //         {
  //           brandName: "Paracetamol",
  //           dosage: "100 ml",
  //           generic: "generic",
  //         },
  //         {
  //           brandName: "Biogesic",
  //           dosage: "15 ml",
  //           generic: "generic",
  //         },
  //       ],
  //     },
  //     pastMedicalHistory: {
  //       hospitalized: "lorem ipsum dolor sit amet",
  //       injuries: "lorem ipsum dolor sit amet",
  //       surgeries: "lorem ipsum dolor sit amet",
  //       allergies: "lorem ipsum dolor sit amet",
  //       measles: "lorem ipsum dolor sit amet",
  //       chickenPox: "lorem ipsum dolor sit amet",
  //       others: "lorem ipsum dolor sit amet",
  //     },
  //     obGyne: {
  //       menstrualCycle: new Date("01-24-1999"),
  //       days: 15,
  //       p: 12,
  //       g: 5,
  //     },
  //   });

  //   console.log(result);
  // };
  // const logPatientsData = () => console.log(patientsData);
  // const logPatientData = () => console.log(patientData);

  // const deletedPatientData = async () => {
  //   const result = await deletePatientMutateAsync({
  //     id: "20c4f0ed-fac4-4730-a736-b37c453b0196",
  //   });
  //   console.log(result);
  // };

  // const logReferencesData = () => {
  //   console.log(referencesData);
  // };
  // const addReference = async () => {
  //   const result = await postReferenceMutateAsync({
  //     code: "jordan",
  //     name: "Jordan",
  //     entityId: 10,
  //   });

  //   console.log(result);
  // };
  // const updateReference = async () => {
  //   const result = await putReferenceMutateAsync({
  //     id: 18,
  //     code: "jordan updated",
  //     name: "Jordan  updated",
  //     entityId: 10,
  //   });

  //   console.log(result);
  // };
  // const deleteReferenceFunc = async () => {
  //   const result = await deleteReferenceMutateAsync({
  //     id: 18,
  //   });

  //   console.log(result);
  // };

  // const logEntitiesData = () => {
  //   console.log(entitiesData);
  // };
  // const addEntity = async () => {
  //   const result = await postEntityMutateAsync({
  //     code: "brand",
  //     name: "Brand",
  //     fieldProp: "brand",
  //   });

  //   console.log(result);
  // };
  // const updateEntity = async () => {
  //   const result = await putEntityMutateAsync({
  //     id: 10,
  //     code: "brand updated",
  //     name: "Brand updated",
  //     fieldProp: "brandUpdated",
  //   });

  //   console.log(result);
  // };
  // const deleteEntityFunc = async () => {
  //   const result = await deleteEntityMutateAsync({
  //     id: 10,
  //   });

  //   console.log(result);
  // };

  // const addPhysicalCheckup = () => {
  //   physicalCheckupMutate(
  //     {
  //       patientId: "7f63d842-bfc7-465d-81f4-65f2dd7b565b",
  //       physicianId: "4dee3e7c-cd1a-11ed-afa1-0242ac120002",
  //       vitalSigns: {
  //         t: 50,
  //         p: 50,
  //         bp: "150-200",
  //         ht: 150,
  //         wt: 100,
  //         r: 20,
  //         cbg: 150,
  //       },
  //       diagnoses: [
  //         {
  //           name: " Alzheimer’s disease",
  //         },
  //       ],
  //       treatments: [
  //         {
  //           medicineId: 20,
  //           signa: "Once a day after meal",
  //         },
  //         {
  //           medicineId: 21,
  //           signa: "Once a day after meal",
  //         },
  //       ],
  //       followUp: new Date("04-22-2023"),
  //       dietaryAdviseGiven: "Drink more milk and eat more on vegetables.",
  //     },
  //     {
  //       onSuccess(data) {
  //         console.log("🚀 ~ file: test.tsx:280 ~ onSuccess ~ data:", data);
  //       },
  //     }
  //   );
  // };

  // const logPhysicalCheckupByPatietId = () => {
  //   console.log(PhysicalCheckupsData);
  // };
  // const logPhysicalCheckup = () => {
  //   console.log(PhysicalCheckupData);
  // };

  const handleCheckDate = () => {
    console.log('is Today:', checkDate(new Date('04/23/2023')).isToday());
    console.log('is Yesterday:', checkDate(new Date('04/22/2023')).isYesterday());
    console.log('is With in this week:', checkDate(new Date('04/22/2023')).isWithinThisWeek());
    console.log('is With in this Month:', checkDate(new Date('04/22/2023')).isWithinThisMonth());
    console.log('is With in this Year:', checkDate(new Date('04/22/2023')).isWithinThisYear());
  };

  const handleCheckDateRange = () => {
    console.log(
      'Is Between: ',
      checkDateRange(new Date('04/22/2023'), new Date('04/22/2023'), new Date('04/23/2023')).isBetweenOrEqual()
    );
  };

  const [startDateRange, setStartDateRange] = useState<Date>(new Date());
  const [endDateRange, setEndDateRange] = useState<Date>(moment(new Date()).add(45).toDate());

  interface PickerProps {
    label?: string;
    end: Date | number;
    start: Date | number;
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState('0');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value as string);
  };

  const handleClick = () => {
    setIsOpen(prev => !prev);
  };

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const { start, end, label } = props;

    const startDate = moment(start).format('L');
    const endDate = end !== null ? ` - ${moment(end).format('L')}` : null;

    const value = `${startDate}${endDate !== null ? endDate : ''}`;

    return <TextField inputRef={ref} label={label || ''} value={value} />;
  });

  return (
    <div>
      <Button onClick={() => handleCheckDate()}>Check Date</Button>
      <Button onClick={() => handleCheckDateRange()}>Check Date Range</Button>
      {JSON.stringify(watch(), null, 2)}

      <Button onClick={handleClick}>Show Date Range</Button>
      <div>
        <Controller
          control={control}
          name='date'
          render={({ field }) => (
            <DatePickerWrapper>
              <DatePicker
                showYearDropdown
                showMonthDropdown
                name='date'
                id='basic-input'
                selected={field.value}
                onChange={field.onChange}
                placeholderText='Date'
                customInput={<TextField label='Sample Date' />}
              />
            </DatePickerWrapper>
          )}
        />
      </div>

      <div>
        {/* <DatePickerWrapper>
          <DatePicker
            selectsRange
            monthsShown={2}
            endDate={endDateRange}
            selected={startDateRange}
            startDate={startDateRange}
            shouldCloseOnSelect={false}
            id='date-range-picker-months'
            onChange={handleOnChangeRange}
            popperPlacement={popperPlacement}
            customInput={
              <CustomInput
                label='Date Range'
                end={endDateRange as Date | number}
                start={startDateRange as Date | number}
              />
            }
          />
        </DatePickerWrapper>

        <DatePickerWrapper>
          <PickersRange popperPlacement={popperPlacement} />
        </DatePickerWrapper> */}

        <div>{JSON.stringify(startDateRange, null, 2)}</div>
        <div>{JSON.stringify(endDateRange, null, 2)}</div>

        <div>{JSON.stringify(selectValue, null, 2)}</div>
        <Select value={selectValue} onChange={handleChange}>
          <MenuItem value={'0'}>Select Value</MenuItem>
          <MenuItem value={'1'}>Value 1</MenuItem>
          <MenuItem value={'2'}>Value 2</MenuItem>
          <MenuItem value={'3'}>Value 3</MenuItem>
          <DatePickerWrapper onClick={() => setSelectValue('4')}>
            <DatePicker
              selectsRange
              monthsShown={2}
              endDate={endDateRange}
              selected={startDateRange}
              startDate={startDateRange}
              shouldCloseOnSelect={false}
              id='date-range-picker-months'
              onChange={handleOnChangeRange}
              popperPlacement={popperPlacement}
              customInput={<MenuItem value={'4'}>Value 4</MenuItem>}
            />
          </DatePickerWrapper>
        </Select>

        {/* <DatePickerWrapper>
          <DatePicker
            selectsRange
            monthsShown={2}
            name='dateRangeInputValue'
            placeholderText='MM/DD/YYYY - MM/DD/YYYY'
            startDate={startDateRange}
            endDate={endDateRange}
            selected={moment(startDateRange).isValid() ? startDateRange : null}
            shouldCloseOnSelect={false}
            onChange={(date: Date) => setStartDateRange(new Date(date))}
            popperPlacement='bottom-start'
          />
        </DatePickerWrapper> */}
      </div>
    </div>
  );
};

export default Test;

Test.acl = {
  action: 'read',
  subject: 'patient'
};
