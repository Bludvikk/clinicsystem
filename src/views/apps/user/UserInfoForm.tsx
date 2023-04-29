import { useState, useEffect } from 'react';

import { Box, Grid } from '@mui/material';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { FormControlPropsType, FormPropsType } from '@/utils/common.type';
import { userDtoSchema, UserDtoSchemaType, UserUnionFieldType } from '@/server/schema/user';
import { getUser, postUser } from '@/server/hooks/user';
import { errorUtil } from '@/utils/helper';
import { FormObjectComponent } from '@/utils/form.component';
import { useUserFormStore } from '@/stores/user.store';
import { getReferences } from '@/server/hooks/reference';

const UserInfoForm = ({ formId }: FormPropsType) => {
  const { id, onClosing, onSaving } = useUserFormStore();

  const userData = getUser({ id });
  const { data: referencesData } = getReferences({ entities: [6, 8] });

  const emptyField = {
    firstName: '',
    lastName: '',
    middleInitial: '',
    userName: '',
    email: '',
    password: '',
    departmentId: 0,
    roleId: 0,
    statusId: 0
  };
  const [defaultValues, setDefaultValues] = useState<UserDtoSchemaType>(emptyField);
  const { mutate: postUserMutate, isLoading: postUserIsLoading } = postUser();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors }
  } = useForm<UserDtoSchemaType>({
    defaultValues,
    resolver: zodResolver(userDtoSchema),
    mode: 'onChange'
  });

  const USER_PANEL = ['General'] as const;
  const USER_FIELDS: Record<(typeof USER_PANEL)[number], FormControlPropsType<UserUnionFieldType>[]> = {
    General: [
      {
        label: 'First Name',
        dbField: 'firstName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 5 } }
      },
      {
        label: 'Last Name',
        dbField: 'lastName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 5 } }
      },
      {
        label: 'Middle Initial',
        dbField: 'middleInitial',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 2 } }
      },
      {
        label: 'User Name',
        dbField: 'userName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12 } }
      },
      {
        label: 'Email',
        dbField: 'email',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12 } }
      },
      {
        label: 'Password',
        dbField: 'password',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { type: 'password' }
        }
      },
      {
        label: 'Roles',
        dbField: 'roleId',
        type: 'dropDown',
        entityId: 6,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Department',
        dbField: 'departmentId',
        type: 'dropDown',
        entityId: 7,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      }
    ]
  };

  const handleClose = () => {
    onClosing();
    reset();
  };

  const onSubmit: SubmitHandler<UserDtoSchemaType> = data => {
    postUserMutate(
      { params: { id, module: 'User' }, body: data },
      {
        onSuccess: data => {
          toast.success(data.message);
          handleClose();
        },
        onError: err => {
          const { status, message } = errorUtil(err);

          if (status === 'CONFLICT') toast.error(message);
          if (status === 'ERROR') {
            handleClose();
            toast.error(message);
          }
        }
      }
    );
  };

  useEffect(() => {
    if (referencesData && referencesData?.length > 0 && !id) {
      setValue('roleId', referencesData.filter(ref => ref.entityId === 6).find(ref => ref.isDefault)!.id);
      setValue('statusId', referencesData.filter(ref => ref.entityId === 8).find(ref => ref.isDefault)!.id);
    }
  }, [referencesData]);

  useEffect(() => {
    if (id && userData) reset(userData);
  }, [id]);

  useEffect(() => {
    onSaving(postUserIsLoading);
  }, [postUserIsLoading]);

  return (
    <Box>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          {USER_FIELDS['General'].map((obj, i) => (
            <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
              <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
            </Grid>
          ))}
        </Grid>
      </form>
    </Box>
  );
};

export default UserInfoForm;
