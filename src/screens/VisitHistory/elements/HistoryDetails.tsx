import { BSpacer, BDivider } from '@/components';
import { layout } from '@/constants';
import { VisitHistoryPayload } from '@/machine/visitHistoryMachine';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Estimation from './Estimation';
import Notes from './Note';
import PaymentType from './PaymentType';
import Pic from './Pic';
import Product from './Product';
import ProjectPhase from './ProjectPhase';
import VisitationDatesAndStatus from './VisitationDatesAndStatus';

const HistoryDetails = ({ details }: { details: VisitHistoryPayload }) => {
  return (
    <ScrollView>
      <BSpacer size="small" />
      <VisitationDatesAndStatus
        status={details.status}
        bookingDate={details.dateVisit}
        finishDate={details.finishDate}
      />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <Pic pic={details?.project?.pic} />
      <BSpacer size="small" />
      <ProjectPhase phase={details?.project?.stage} />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <Product products={details?.project?.products} />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <Estimation />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <PaymentType />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <Notes />
      <BSpacer size="small" />
      <BSpacer size="small" />
    </ScrollView>
  );
};

export default HistoryDetails;
