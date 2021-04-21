FROM registry.access.redhat.com/ubi8-minimal

##LABELS

RUN microdnf update && microdnf clean all && rm -rf /var/cache/yum/*

COPY extensions.sh ./

CMD [ "./extensions.sh"]

