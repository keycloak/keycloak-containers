FROM registry.access.redhat.com/ubi8/ubi-minimal:latest

##LABELS

COPY extensions.sh ./

## We do not allow changing crypto policies in init container from the default one, thus can remove several huge packages with potential for respins
RUN rpm -e --nodeps platform-python python3-libs platform-python-setuptools && rpm -e python3-pip-wheel python3-setuptools-wheel

CMD [ "./extensions.sh"]

