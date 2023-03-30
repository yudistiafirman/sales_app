import { BSpacer, BDivider } from '@/components';
import { layout } from '@/constants';
import { VisitHistoryPayload } from '@/machine/visitHistoryMachine';
import React from 'react';
import { View } from 'react-native';
import Estimation from './Estimation';
import Notes from './Note';
import PaymentType from './PaymentType';
import Pic from './Pic';
import Product from './Product';
import ProjectPhase from './ProjectPhase';
import VisitationDatesAndStatus from './VisitationDatesAndStatus';

const HistoryDetails = ({ details }: { details: VisitHistoryPayload }) => {
  return (
    <View>
      <BSpacer size="small" />
      <VisitationDatesAndStatus
        status={details.status}
        bookingDate={details.dateVisit}
        finishDate={details.finishDate}
        rejectCategory={details.rejectCategory}
        quatationId={details?.QuotationRequests && details?.QuotationRequests.length > 0 ? 
          details?.QuotationRequests[0]?.QuotationLetter?.id : undefined}
        rejectNotes={details?.rejectNotes}
      />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <Pic pic={details?.project?.Pic} />
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
      <Product products={details?.products} />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <Estimation
        estimationWeek={details.estimationWeek}
        estimationMonth={details.estimationMonth}
      />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <PaymentType paymentType={details.paymentType} />
      <BSpacer size="small" />
      <BDivider
        borderBottomWidth={1}
        flex={0}
        height={0.1}
        marginHorizontal={layout.pad.lg}
      />
      <BSpacer size="small" />
      <Notes visitNotes={details.visitNotes} />
      <BSpacer size="small" />
      <BSpacer size="small" />
    </View>
  );
};

export default HistoryDetails;
