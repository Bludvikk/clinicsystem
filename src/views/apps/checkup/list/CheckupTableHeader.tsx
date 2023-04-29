import { Box, Button, CardContent, CardHeader, Divider, Grid, MenuItem, TextField } from '@mui/material';
import Icon from '@/@core/components/icon';

import { MouseEventHandler, RefObject, forwardRef, useEffect } from 'react';
import { useFilterControlChange } from '@/utils/helper';
import { useCheckupFormStore } from '@/stores/checkup.store';
import { DateRangeInputSearch, DropdownData, TextInputSearch } from '@/utils/form.component';

interface CheckupTableHeaderProsType {
  physicianId?: number;
}

const CheckupTableHeader = ({ physicianId }: CheckupTableHeaderProsType) => {
  const {
    searchFilter,
    setSearchFilter: filterControlSetSearchFilter,
    handleSearchFilter,
    handleDateRangeFilter
  } = useFilterControlChange();
  const { setSearchFilter } = useCheckupFormStore();

  const filterTableHeader = new Map([['tableHeader', [13, 11]]]).get('tableHeader');
  const dataLoaded = !!filterTableHeader;

  useEffect(() => {
    setSearchFilter(searchFilter);
  }, [searchFilter]);

  useEffect(() => {
    if (physicianId) filterControlSetSearchFilter(prev => ({ ...prev, dropDown: { physicianId } }));
  }, [physicianId]);

  interface CustomMenuItemProps {
    value?: string;
    onClick?: any;
  }

  const CustomMenuItem = forwardRef(({ value, onClick }: CustomMenuItemProps, ref) => {
    const handleClick = () => {
      if (searchFilter.dropDown) {
        const newSearchFilter = searchFilter;
        delete searchFilter.dropDown.timeframe;
        filterControlSetSearchFilter(newSearchFilter);
      }
      onClick();
    };

    return (
      <MenuItem value='dateRange' onClick={handleClick}>
        {value ? value : 'Date Range'}
      </MenuItem>
    );
  });

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
        {dataLoaded ? (
          <CardContent>
            <Grid container spacing={6}>
              {filterTableHeader.map(entityId => (
                <Grid key={entityId} item sm={4} xs={12}>
                  <DropdownData
                    type='filter'
                    id={entityId}
                    handleSearchFilter={handleSearchFilter}
                    searchFilterValue={searchFilter}
                    customMenuItem={{
                      dateRange: (
                        <DateRangeInputSearch
                          reactDatePickerAttribute={{
                            popperPlacement: 'auto-start',
                            popperProps: {
                              strategy: 'fixed'
                            }
                          }}
                          handleDateRangeFilter={handleDateRangeFilter}
                          searchFilterValue={searchFilter}
                          customInput={<CustomMenuItem />}
                        />
                      )
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        ) : null}

        <Divider />
        <Grid
          container
          sx={{
            p: 5,
            pb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button
            sx={{ mr: 4, mb: 2 }}
            color='secondary'
            variant='outlined'
            startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
          >
            Export
          </Button>

          <Grid item container justifyContent='flex-end' xs={6} spacing={3}>
            <Grid item xs={6}>
              <TextInputSearch
                handleSearchFilter={handleSearchFilter}
                searchFilterValue={searchFilter}
                textFieldAttribute={{ size: 'small', sx: { mb: 2 }, fullWidth: true }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CheckupTableHeader;
